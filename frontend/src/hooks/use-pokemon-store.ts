import { useContext } from 'react';
import { PokemonStoreContext } from '../context/pokemon-store-provider';

export function usePokemonStore() {
  const ctx = useContext(PokemonStoreContext);
  if (!ctx) {
    throw new Error('usePokemonStore must be used inside PokemonStoreProvider');
  }
  return ctx;
}
