// src/components/pokemon/PokemonList.tsx
import React, { useCallback, useMemo } from 'react';
import { FixedSizeList as WindowedList } from 'react-window';
import { usePokemonList } from '../../hooks/use-pokemon-list';
import { useFavorites } from '../../hooks/use-favorites';
import { useSelection } from '../../hooks/use-selection';
import { Spinner } from '../layout/Spinner';
import { ErrorBanner } from '../layout/ErrorBanner';
import { PokemonListItem } from './PokemonListItem';

const ITEM_HEIGHT = 60;

type ItemData = {
  items: ReturnType<typeof usePokemonList>['filteredList'];
  favoriteIds: ReturnType<typeof useFavorites>['favoriteIds'];
  selectedPokemonId: ReturnType<typeof useSelection>['selectedPokemonId'];
  selectPokemon: ReturnType<typeof useSelection>['selectPokemon'];
  toggleFavorite: ReturnType<typeof useFavorites>['toggleFavorite'];
};

export const PokemonList: React.FC = () => {
  const { filteredList, listStatus, listError } = usePokemonList();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { selectedPokemonId, selectPokemon } = useSelection();

  const itemData: ItemData = useMemo(
    () => ({
      items: filteredList,
      favoriteIds,
      selectedPokemonId,
      selectPokemon,
      toggleFavorite
    }),
    [filteredList, favoriteIds, selectedPokemonId, selectPokemon, toggleFavorite]
  );

  const Row = useCallback(
    ({
      index,
      style,
      data
    }: {
      index: number;
      style: React.CSSProperties;
      data: ItemData;
    }) => {
      const pokemon = data.items[index];

      return (
        <div style={style} className="px-1 py-1">
          <PokemonListItem
            pokemon={pokemon}
            index={index}
            isSelected={data.selectedPokemonId === pokemon.id}
            isFavorite={data.favoriteIds.has(pokemon.id)}
            onSelect={data.selectPokemon}
            onToggleFavorite={data.toggleFavorite}
          />
        </div>
      );
    },
    []
  );

  if (listStatus === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (listStatus === 'error') {
    return (
      <div className="p-3">
        <ErrorBanner message={listError ?? 'Failed to load Pokémon'} />
      </div>
    );
  }

  if (!filteredList.length) {
    return (
      <div className="p-3 text-sm text-slate-400">
        No Pokémon found. Try changing your search/filter.
      </div>
    );
  }

  return (
    <WindowedList
      height={600}
      width="100%"
      itemCount={filteredList.length}
      itemSize={ITEM_HEIGHT}
      itemData={itemData}
    >
      {Row}
    </WindowedList>
  );
};
