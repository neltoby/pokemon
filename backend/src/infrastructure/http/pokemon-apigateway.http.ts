// src/infrastructure/http/PokeApiGateway.ts
import axios, { AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import http from 'http';
import https from 'https';
import {
  IPokemonGateway,
  PokemonDetails,
  PokemonSummary,
} from '../../domain/repositories/interface/pokemon-gateway.interface';
import { env } from '../../config/env';
import {
  AXIOS_RETRIES,
  DETAILS_TTL_MS,
  LRU_DEFAULT_TTL_MS,
  LRU_MAX_SIZE,
  SEMAPHORE_MAX_CONCURRENCY,
  UPSTREAM_TIMEOUT_MS,
  DEFAULT_PAGE_SIZE,
  FIRST_GENERATION_MAX,
} from '../../shared/constants';

// Lightweight in-memory LRU cache with TTL
class SimpleLRU<V> {
  private store: Map<string, { value: V; expiresAt: number }> = new Map();
  constructor(private readonly maxSize: number, private readonly defaultTtlMs: number) {}

  get(key: string): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    // refresh LRU order
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  set(key: string, value: V, ttlMs?: number): void {
    if (this.store.has(key)) {
      this.store.delete(key);
    }
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.store.set(key, { value, expiresAt });
    // evict LRU
    if (this.store.size > this.maxSize) {
      const oldest = this.store.keys().next().value as string | undefined;
      if (oldest !== undefined) this.store.delete(oldest);
    }
  }
}

// Simple semaphore to cap concurrent upstream requests
class SimpleSemaphore {
  private current = 0;
  private queue: Array<() => void> = [];
  constructor(private readonly max: number) {}
  async acquire(): Promise<() => void> {
    if (this.current < this.max) {
      this.current++;
      return () => this.release();
    }
    await new Promise<void>(resolve => this.queue.push(resolve));
    this.current++;
    return () => this.release();
  }
  private release() {
    this.current--;
    const next = this.queue.shift();
    if (next) next();
  }
}

export class PokeApiGateway implements IPokemonGateway {
  private readonly baseUrl: string;
  private readonly client: AxiosInstance;
  private readonly cache: SimpleLRU<unknown>;
  private readonly inflight: Map<string, Promise<unknown>> = new Map();
  private readonly sem: SimpleSemaphore;

  constructor() {
    this.baseUrl = env.POKEAPI_BASE_URL;

    // axios instance with keep-alive + timeout
    const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50 });
    const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50 });
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: UPSTREAM_TIMEOUT_MS,
      httpAgent,
      httpsAgent,
    });

    axiosRetry(this.client, {
      retries: AXIOS_RETRIES,
      retryDelay: axiosRetry.exponentialDelay,
      shouldResetTimeout: true,
      retryCondition: (error) => {
        const status = error.response?.status;
        // retry on network errors and 5xx (exclude 4xx)
        return axiosRetry.isNetworkError(error) || (!!status && status >= 500);
      },
    });

    // LRU cache (size tuned for project scale)
    this.cache = new SimpleLRU<unknown>(LRU_MAX_SIZE, LRU_DEFAULT_TTL_MS);
    // Limit upstream concurrency to avoid socket/CPU contention
    this.sem = new SimpleSemaphore(SEMAPHORE_MAX_CONCURRENCY);

    // Warm cache for the first generation asynchronously
    setTimeout(() => {
      for (let offset = 0; offset < FIRST_GENERATION_MAX; offset += DEFAULT_PAGE_SIZE) {
        this.listFirstGeneration(DEFAULT_PAGE_SIZE, offset).catch(() => {});
      }
    }, 0);
  }

  private async getUpstream<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const release = await this.sem.acquire();
    try {
      return await this.client.get<T>(url, config);
    } finally {
      release();
    }
  }

  private async cached<T>(key: string, ttlMs: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached as T;

    const pending = this.inflight.get(key);
    if (pending) return pending as Promise<T>;

    const p = (async () => {
      try {
        const value = await fetcher();
        this.cache.set(key, value, ttlMs);
        return value;
      } finally {
        this.inflight.delete(key);
      }
    })();
    this.inflight.set(key, p);
    return p;
  }

  async listFirstGeneration(limit: number, offset: number): Promise<PokemonSummary[]> {
    const MAX_TOTAL = 150;
    if (offset >= MAX_TOTAL) return [];
    const effectiveLimit = Math.min(limit, Math.max(0, MAX_TOTAL - offset));
    if (effectiveLimit <= 0) return [];
    const key = `list:${effectiveLimit}:${offset}`;
    return this.cached<PokemonSummary[]>(
      key,
      LRU_DEFAULT_TTL_MS,
      async () => {
        interface PokeListResponse {
          results: { name: string; url: string }[];
        }
        const resp = await this.getUpstream<PokeListResponse>(`/pokemon`, {
          params: { limit: effectiveLimit, offset },
        });
        return resp.data.results.map(({ name, url }) => {
          const m = /\/pokemon\/(\d+)\/?$/.exec(url);
          const id = m ? parseInt(m[1], 10) : NaN;
          const thumbUrl = Number.isFinite(id) && id > 0
            ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            : undefined;
          return { id, name, url, thumbUrl } satisfies PokemonSummary;
        });
      },
    );
  }

  async getDetails(nameOrId: string | number): Promise<PokemonDetails> {
    const key = `details:${nameOrId}`;
    return this.cached<PokemonDetails>(
      key,
      DETAILS_TTL_MS,
      async () => {
        interface PokemonResponse {
          id: number;
          name: string;
          abilities: { ability: { name: string } }[];
          types: { type: { name: string } }[];
          species: { url: string };
          sprites?: {
            back_default?: string | null;
            front_default?: string | null;
            other?: {
              [k: string]: { front_default?: string | null } | undefined;
            };
          };
        }
        interface SpeciesResponse {
          evolution_chain?: { url?: string | null } | null;
        }
        interface EvolutionChainNode {
          species: { name: string };
          evolves_to: EvolutionChainNode[];
        }
        interface EvolutionChainResponse {
          chain: EvolutionChainNode;
        }

        const pokemonResp = await this.getUpstream<PokemonResponse>(
          `/pokemon/${nameOrId}`,
        );

        const speciesResp = await this.getUpstream<SpeciesResponse>(
          pokemonResp.data.species.url,
        );
        const evolutionChainUrl = speciesResp.data.evolution_chain?.url ?? undefined;

        let evolutions: string[] = [];
        if (evolutionChainUrl) {
          const evolutionResp = await this.getUpstream<EvolutionChainResponse>(
            evolutionChainUrl,
          );
          evolutions = this.extractEvolutions(evolutionResp.data.chain);
        }

        const sprites = pokemonResp.data.sprites;
        const imageUrl = sprites?.back_default ?? null;
        const thumbUrl = sprites?.front_default ?? null;
        const artworkUrl = sprites?.other?.["official-artwork"]?.front_default ?? null;

        return {
          id: pokemonResp.data.id,
          name: pokemonResp.data.name,
          abilities: pokemonResp.data.abilities.map((a) => a.ability.name),
          types: pokemonResp.data.types.map((t) => t.type.name),
          evolutions,
          imageUrl,
          thumbUrl,
          artworkUrl,
        };
      },
    );
  }

  private extractEvolutions(chainNode: unknown): string[] {
    type Node = { species: { name: string }; evolves_to: Node[] };
    const node = chainNode as Node;
    const result: string[] = [];

    const traverse = (n: Node | null | undefined) => {
      if (!n) return;
      result.push(n.species.name);
      if (n.evolves_to && n.evolves_to.length > 0) {
        n.evolves_to.forEach((child) => traverse(child));
      }
    };

    traverse(node);

    // remove duplicates and return
    return [...new Set(result)];
  }
}
