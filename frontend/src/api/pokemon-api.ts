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

export async function fetchPokemonList(limit = 150): Promise<PokemonSummary[]> {
  return getJSON<PokemonSummary[]>('/api/pokemon', { params: { limit } });
}

export async function fetchPokemonDetails(
  nameOrId: string | number
): Promise<PokemonDetails> {
  return getJSON<PokemonDetails>(`/api/pokemon/${nameOrId}`);
}
