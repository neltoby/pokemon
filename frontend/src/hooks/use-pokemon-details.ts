import { useEffect } from 'react';
import { usePokemonStore } from './use-pokemon-store';
import { fetchPokemonDetails } from '../api/pokemon-api';

export function usePokemonDetails(pokemonId: number | null) {
  const { state, dispatch } = usePokemonStore();
  const { list, detailsById, detailsStatusById, detailsErrorById } = state;

  const status = pokemonId ? detailsStatusById[pokemonId] || 'idle' : 'idle';
  const error = pokemonId ? detailsErrorById[pokemonId] || null : null;
  const details = pokemonId ? detailsById[pokemonId] : null;

  useEffect(() => {
    if (!pokemonId) return;
    // Avoid refetch if we already have details in store
    if (details) return;

    const pokemon = list.find(p => p.id === pokemonId);
    const nameOrId = pokemon?.name || pokemonId;

    let cancelled = false;

    const load = async () => {
      dispatch({
        type: 'SET_DETAILS_LOADING',
        payload: { pokemonId }
      });
      try {
        const data = await fetchPokemonDetails(nameOrId);
        if (cancelled) return;
        dispatch({
          type: 'SET_DETAILS_SUCCESS',
          payload: { pokemonId, details: data }
        });
      } catch (err: any) {
        if (cancelled) return;
        dispatch({
          type: 'SET_DETAILS_ERROR',
          payload: {
            pokemonId,
            error:
              err?.message || 'Failed to load Pokémon details'
          }
        });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [pokemonId, details, list, dispatch]);

  return { details, status, error };
}
