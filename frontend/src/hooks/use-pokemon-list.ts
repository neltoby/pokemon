import { useEffect, useMemo, useRef, useCallback } from 'react';
import { usePokemonStore } from './use-pokemon-store';
import { fetchPokemonPage } from '../api/pokemon-api';

const PAGE_SIZE = 50;

export function usePokemonList() {
  const { state, dispatch } = usePokemonStore();
  const {
    list,
    listStatus,
    listError,
    listHasMore,
    listNextOffset,
    favorites,
    searchTerm,
    showFavoritesOnly,
  } =
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
        const page = await fetchPokemonPage(PAGE_SIZE, 0);
        if (cancelled) return;
        dispatch({ type: 'SET_LIST_SUCCESS', payload: page });
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
    if (showFavoritesOnly) {
      // Render from favorites directly so we don't depend on loaded pages
      let favs = favorites.map(f => ({ id: f.pokemonId, name: f.pokemonName, url: '' }));
      if (searchTerm.trim()) {
        const term = searchTerm.trim().toLowerCase();
        favs = favs.filter(p => p.name.toLowerCase().includes(term));
      }
      return favs;
    }

    let result = list;
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }
    return result;
  }, [list, favorites, searchTerm, showFavoritesOnly]);

  const loadingMoreRef = useRef(false);
  const loadMore = useCallback(async () => {
    if (showFavoritesOnly) return; // no paging in favorites-only mode
    if (loadingMoreRef.current) return;
    if (!listHasMore) return;
    if (listNextOffset == null) return;
    loadingMoreRef.current = true;
    try {
      const page = await fetchPokemonPage(PAGE_SIZE, listNextOffset);
      dispatch({ type: 'APPEND_LIST_SUCCESS', payload: page });
    } finally {
      loadingMoreRef.current = false;
    }
  }, [showFavoritesOnly, listHasMore, listNextOffset, dispatch]);

  return {
    listStatus,
    listError,
    favoriteIds,
    filteredList,
    hasMore: showFavoritesOnly ? false : listHasMore,
    loadMore
  };
}
