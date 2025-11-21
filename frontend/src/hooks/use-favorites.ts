import { useEffect, useMemo, useCallback, useRef } from 'react';
import { usePokemonStore } from './use-pokemon-store';
import {
  fetchFavorites,
  addFavorite,
  removeFavorite
} from '../api/favourite-api';

export function useFavorites() {
  const { state, dispatch } = usePokemonStore();
  const { favorites, favoritesStatus, favoritesError } = state;

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    const load = async () => {
      dispatch({ type: 'SET_FAVORITES_LOADING' });
      try {
        const data = await fetchFavorites();
        if (cancelled) return;
        dispatch({ type: 'SET_FAVORITES_SUCCESS', payload: data });
      } catch (err: any) {
        if (cancelled) return;
        dispatch({
          type: 'SET_FAVORITES_ERROR',
          payload: err?.message || 'Failed to load favorites'
        });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map(f => f.pokemonId)),
    [favorites]
  );

  const isFavorite = useCallback(
    (pokemonId: number) => favoriteIds.has(pokemonId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (pokemonId: number, pokemonName: string) => {
      if (favoriteIds.has(pokemonId)) {
        await removeFavorite(pokemonId);
        // refetch or optimistic update
        const updated = favorites.filter(f => f.pokemonId !== pokemonId);
        dispatch({
          type: 'SET_FAVORITES_SUCCESS',
          payload: updated
        });
      } else {
        await addFavorite(pokemonId, pokemonName);
        const updated = [
          ...favorites,
          {
            id: `${Date.now()}-${pokemonId}`,
            pokemonId,
            pokemonName,
            createdAt: new Date().toISOString()
          }
        ];
        dispatch({
          type: 'SET_FAVORITES_SUCCESS',
          payload: updated
        });
      }
    },
    [favoriteIds, favorites, dispatch]
  );

  return {
    favorites,
    favoritesStatus,
    favoritesError,
    favoriteIds,
    isFavorite,
    toggleFavorite
  };
}
