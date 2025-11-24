// src/components/pokemon/PokemonList.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { FixedSizeList as WindowedList } from 'react-window';
import { useInfiniteLoader } from 'react-window-infinite-loader';
import { usePokemonList } from '../../hooks/use-pokemon-list';
import { useFavorites } from '../../hooks/use-favorites';
import { useSelection } from '../../hooks/use-selection';
import { ErrorBanner } from '../layout/ErrorBanner';
import { PokemonListItem } from './PokemonListItem';
import { useListboxNavigation } from '../../hooks/use-listbox-navigation';
import { useScrollHint } from '../../hooks/use-scroll-hint';
import { ScrollHint } from '../ui/ScrollHint';
import { ScrollFades } from '../ui/ScrollFades';
import { useElementSize } from '../../hooks/use-element-size';
import { useScrollFades } from '../../hooks/use-scroll-fades';
import { ErrorBoundary } from '../layout/ErrorBoundary';

import { LIST_ITEM_HEIGHT, LIST_MIN_HEIGHT_PX, LIST_SKELETON_ROW_COUNT, INFINITE_LOADER_THRESHOLD } from '../../constants/ui';

type ItemData = {
  items: ReturnType<typeof usePokemonList>['filteredList'];
  favoriteIds: ReturnType<typeof useFavorites>['favoriteIds'];
  selectedPokemonId: ReturnType<typeof useSelection>['selectedPokemonId'];
  selectPokemon: ReturnType<typeof useSelection>['selectPokemon'];
  toggleFavorite: ReturnType<typeof useFavorites>['toggleFavorite'];
};

export const PokemonList: React.FC<{ focusRef?: React.Ref<HTMLDivElement>; height?: number }> = ({ focusRef, height }) => {
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
        <div
          style={style}
          className="px-1 py-1"
          id={`pokemon-option-${pokemon.id}`}
          role="option"
          aria-selected={data.selectedPokemonId === pokemon.id}
        >
          <ErrorBoundary
            name={`row-${pokemon.id}`}
            fallback={(error) => (
              <div className="p-2"><ErrorBanner message={error.message || 'Row failed'} /></div>
            )}
          >
            <PokemonListItem
              pokemon={pokemon}
              index={index}
              isSelected={data.selectedPokemonId === pokemon.id}
              isFavorite={data.favoriteIds.has(pokemon.id)}
              onSelect={data.selectPokemon}
              onToggleFavorite={data.toggleFavorite}
            />
          </ErrorBoundary>
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
    threshold: INFINITE_LOADER_THRESHOLD
  });

  const listRef = useRef<WindowedList<ItemData> | null>(null);
  const { activeIndex, aria } = useListboxNavigation({
    items: filteredList,
    selectedId: selectedPokemonId,
    onSelect: selectPokemon,
    onToggleFavorite: toggleFavorite,
  });

  const { visible: showHint, onListScroll, onWrapperKeyDown } = useScrollHint();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { height: containerHeight } = useElementSize(containerRef);
  const { showTop, showBottom, handleItemsRendered } = useScrollFades(itemCount);

  // Scroll active item into view when selection changes
  useEffect(() => {
    if (activeIndex >= 0) listRef.current?.scrollToItem(activeIndex, 'smart');
  }, [activeIndex]);

  if (listStatus === 'loading') {
    return (
      <div className="space-y-2">
        {Array.from({ length: LIST_SKELETON_ROW_COUNT }).map((_, i) => (
          <div key={i} className="px-1 py-1">
            <div className="h-14 rounded-xl bg-slate-800/50 animate-pulse" />
          </div>
        ))}
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
    <div
      id="list-panel"
      ref={(el) => {
        containerRef.current = el;
        if (typeof focusRef === 'function') focusRef(el);
        else if (focusRef && 'current' in (focusRef as React.MutableRefObject<HTMLDivElement | null>)) {
          (focusRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      }}
      aria-label="Pokémon list"
      className="relative h-full focus:outline-none focus:ring-2 focus:ring-primary/70 rounded-xl"
      style={{ minHeight: LIST_MIN_HEIGHT_PX }}
      {...({
        ...aria,
        onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => { aria.onKeyDown?.(e); onWrapperKeyDown(e); }
      } as React.HTMLAttributes<HTMLDivElement>)}
    >
      <WindowedList
        height={(height && height > 0) ? height : (containerHeight > 0 ? containerHeight : 360)}
        width="100%"
        itemCount={itemCount}
        itemSize={LIST_ITEM_HEIGHT}
        itemData={itemData}
        ref={(instance) => { (listRef as React.MutableRefObject<WindowedList<ItemData> | null>).current = instance as WindowedList<ItemData> | null; }}
        onScroll={onListScroll}
        itemKey={(index: number) => (index < filteredList.length ? filteredList[index].id : `loader-${index}`)}
        onItemsRendered={({ visibleStartIndex, visibleStopIndex }: { visibleStartIndex: number; visibleStopIndex: number }) => {
          handleItemsRendered({ startIndex: visibleStartIndex, stopIndex: visibleStopIndex });
          onRowsRendered({ startIndex: visibleStartIndex, stopIndex: visibleStopIndex });
        }}
      >
        {Row}
      </WindowedList>
      <ScrollFades showTop={showTop} showBottom={showBottom} />
      <ScrollHint visible={showHint} />
    </div>
  );
};
