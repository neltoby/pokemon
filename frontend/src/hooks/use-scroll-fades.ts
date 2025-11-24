import { useCallback, useState } from 'react';

export function useScrollFades(itemCount: number) {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const handleItemsRendered = useCallback((args: { startIndex: number; stopIndex: number }) => {
    const { startIndex, stopIndex } = args;
    setShowTop(startIndex > 0);
    setShowBottom(stopIndex < itemCount - 1);
  }, [itemCount]);

  return { showTop, showBottom, handleItemsRendered } as const;
}

