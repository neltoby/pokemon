// src/hooks/useSelection.ts
import { useCallback } from 'react';
import { usePokemonStore } from './use-pokemon-store';

export function useSelection() {
  const { state, dispatch } = usePokemonStore();
  const { selectedPokemonId } = state;

  const selectPokemon = useCallback(
    (pokemonId: number | null) => {
      dispatch({
        type: 'SET_SELECTED_POKEMON',
        payload: pokemonId
      });
    },
    [dispatch]
  );

  return { selectedPokemonId, selectPokemon };
}
