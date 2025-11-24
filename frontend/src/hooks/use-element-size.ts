import { useEffect, useState, type RefObject } from 'react';

export function useElementSize<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measureOnce = () => {
      const rect = el.getBoundingClientRect();
      setSize(prev =>
        prev.width !== rect.width || prev.height !== rect.height
          ? { width: rect.width, height: rect.height }
          : prev,
      );
    };

    // initial measure
    measureOnce();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(entries => {
        const entry = entries[0];
        const rect = entry.contentRect;
        setSize(prev =>
          prev.width !== rect.width || prev.height !== rect.height
            ? { width: rect.width, height: rect.height }
            : prev,
        );
      });
      ro.observe(el);
      return () => ro.disconnect();
    }

    return undefined;
  }, [ref]);

  return size;
}
