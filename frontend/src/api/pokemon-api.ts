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
  imageUrl: string | null;
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

export function getPokemonImageUrl(
  id: number,
  variant: 'thumb' | 'artwork' = 'thumb'
): string {
  if (variant === 'artwork') {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonImageCandidates(id: number): string[] {
  // Try multiple well-known sprite sources
  return [
    // Default classic sprite
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    // Official artwork
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    // Home sprites
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`
  ];
}
