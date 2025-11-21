import { apiClient, getJSON } from './client';

export interface Favorite {
  id: string;
  pokemonId: number;
  pokemonName: string;
  createdAt: string;
}

export async function fetchFavorites(): Promise<Favorite[]> {
  return getJSON<Favorite[]>('/api/favorites');
}

export async function addFavorite(pokemonId: number, pokemonName: string) {
  await apiClient.post('/api/favorites', { pokemonId, pokemonName });
}

export async function removeFavorite(pokemonId: number) {
  await apiClient.delete(`/api/favorites/${pokemonId}`);
}
