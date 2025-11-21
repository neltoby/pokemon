// src/components/pokemon/PokemonList.tsx
import React, { useCallback, useMemo } from 'react';
import { FixedSizeList as WindowedList } from 'react-window';
import { useInfiniteLoader } from 'react-window-infinite-loader';
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
  const { filteredList, listStatus, listError, hasMore, loadMore } = usePokemonList();
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
      const isLoaderRow = index >= data.items.length;
      if (isLoaderRow) {
        return (
          <div style={style} className="px-3 py-2 text-xs text-slate-500">
            Loading more...
          </div>
        );
      }
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

  const itemCount = filteredList.length + (hasMore ? 1 : 0);
  const isRowLoaded = (index: number) => index < filteredList.length;
  const loadMoreRows = async (_startIndex: number, _stopIndex: number) => {
    if (hasMore) await loadMore();
  };
  const onRowsRendered = useInfiniteLoader({
    isRowLoaded,
    loadMoreRows,
    rowCount: itemCount,
    threshold: 5
  });

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
      itemCount={itemCount}
      itemSize={ITEM_HEIGHT}
      itemData={itemData}
      itemKey={(index: number) => (index < filteredList.length ? filteredList[index].id : `loader-${index}`)}
      onItemsRendered={({ visibleStartIndex, visibleStopIndex }: { visibleStartIndex: number; visibleStopIndex: number }) =>
        onRowsRendered({ startIndex: visibleStartIndex, stopIndex: visibleStopIndex })
      }
    >
      {Row}
    </WindowedList>
  );
};
