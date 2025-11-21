import { useEffect, useMemo, useRef } from 'react';
import { usePokemonStore } from './use-pokemon-store';
import { fetchPokemonList } from '../api/pokemon-api';

export function usePokemonList() {
  const { state, dispatch } = usePokemonStore();
  const { list, listStatus, listError, favorites, searchTerm, showFavoritesOnly } =
    state;

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (listStatus !== 'idle') return;

    let cancelled = false;

    const load = async () => {
      dispatch({ type: 'SET_LIST_LOADING' });
      try {
        const data = await fetchPokemonList(150);
        if (cancelled) return;
        dispatch({ type: 'SET_LIST_SUCCESS', payload: data });
      } catch (err: any) {
        if (cancelled) return;
        dispatch({
          type: 'SET_LIST_ERROR',
          payload: err?.message || 'Failed to load Pokémon list'
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

  const filteredList = useMemo(() => {
    let result = list;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }

    if (showFavoritesOnly) {
      result = result.filter(p => favoriteIds.has(p.id));
    }

    return result;
  }, [list, searchTerm, showFavoritesOnly, favoriteIds]);

  return {
    listStatus,
    listError,
    favoriteIds,
    filteredList
  };
}
