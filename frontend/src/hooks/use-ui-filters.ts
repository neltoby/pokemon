import { useCallback } from 'react';
import { usePokemonStore } from './use-pokemon-store';

export function useUiFilters() {
  const { state, dispatch } = usePokemonStore();
  const { searchTerm, showFavoritesOnly } = state;

  const setSearchTerm = useCallback(
    (value: string) => {
      dispatch({ type: 'SET_SEARCH_TERM', payload: value });
    },
    [dispatch]
  );

  const setShowFavoritesOnly = useCallback(
    (value: boolean) => {
      dispatch({
        type: 'SET_SHOW_FAVORITES_ONLY',
        payload: value
      });
    },
    [dispatch]
  );

  return {
    searchTerm,
    showFavoritesOnly,
    setSearchTerm,
    setShowFavoritesOnly
  };
}
