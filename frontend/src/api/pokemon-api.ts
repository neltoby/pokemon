import { getJSON } from './client';

export interface PokemonSummary {
  id: number;
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  abilities: string[];
  types: string[];
  evolutions: string[];
}

export interface PokemonPage {
  items: PokemonSummary[];
  hasMore: boolean;
  nextOffset: number | null;
}

export async function fetchPokemonPage(limit = 50, offset = 0): Promise<PokemonPage> {
  return getJSON<PokemonPage>('/api/pokemon', { params: { limit, offset } });
}

export async function fetchPokemonDetails(
  nameOrId: string | number
): Promise<PokemonDetails> {
  return getJSON<PokemonDetails>(`/api/pokemon/${nameOrId}`);
}
