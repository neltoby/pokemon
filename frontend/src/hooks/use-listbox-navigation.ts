import { useCallback, useEffect, useMemo } from 'react';

interface ItemLike { id: number; name: string }

interface Params {
  items: ItemLike[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onToggleFavorite?: (id: number, name: string) => void;
}

export function useListboxNavigation({ items, selectedId, onSelect, onToggleFavorite }: Params) {
  const activeIndex = useMemo(
    () => (selectedId == null ? -1 : items.findIndex((p) => p.id === selectedId)),
    [items, selectedId]
  );

  const selectIndex = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    const item = items[clamped];
    if (item) onSelect(item.id);
  }, [items, onSelect]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selectIndex(activeIndex < 0 ? 0 : activeIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selectIndex(activeIndex <= 0 ? 0 : activeIndex - 1); }
    else if (e.key === 'Home') { e.preventDefault(); selectIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); selectIndex(items.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (activeIndex < 0 && items.length) selectIndex(0); }
    else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      const item = items[activeIndex];
      if (item && onToggleFavorite) onToggleFavorite(item.id, item.name);
    }
  };

  const aria = {
    role: 'listbox',
    tabIndex: 0,
    'aria-activedescendant': selectedId ? `pokemon-option-${selectedId}` : undefined,
    onKeyDown,
  } as const;

  // expose the index to allow consumers to scroll into view
  return { activeIndex, aria };
}

