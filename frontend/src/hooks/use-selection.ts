// src/hooks/useSelection.ts
import { useCallback, useMemo } from 'react';
import { usePokemonStore } from './use-pokemon-store';

export function useSelection() {
  const { state, dispatch } = usePokemonStore();
  const {
    selectedPokemonId,
    list,
    favorites,
    searchTerm,
    showFavoritesOnly
  } = state;

  const filteredList = useMemo(() => {
    if (showFavoritesOnly) {
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

  const selectPokemon = useCallback(
    (pokemonId: number | null) => {
      dispatch({
        type: 'SET_SELECTED_POKEMON',
        payload: pokemonId
      });
    },
    [dispatch]
  );

  const selectNext = useCallback(() => {
    if (!filteredList.length) return;
    if (selectedPokemonId == null) {
      selectPokemon(filteredList[0].id);
      return;
    }
    const idx = filteredList.findIndex(p => p.id === selectedPokemonId);
    const nextIdx = Math.min(filteredList.length - 1, idx + 1);
    if (nextIdx !== idx) selectPokemon(filteredList[nextIdx].id);
  }, [filteredList, selectedPokemonId, selectPokemon]);

  const selectPrev = useCallback(() => {
    if (!filteredList.length) return;
    if (selectedPokemonId == null) {
      selectPokemon(filteredList[0].id);
      return;
    }
    const idx = filteredList.findIndex(p => p.id === selectedPokemonId);
    const prevIdx = Math.max(0, idx - 1);
    if (prevIdx !== idx) selectPokemon(filteredList[prevIdx].id);
  }, [filteredList, selectedPokemonId, selectPokemon]);

  return { selectedPokemonId, selectPokemon, selectNext, selectPrev };
}
