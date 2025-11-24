import { useRef, useCallback } from 'react';
import { HOTKEY_SEQUENCE_TIMEOUT_MS } from '../constants/ui';

export interface HotkeyTargets {
  focusSearch?: () => void;
  focusList?: () => void;
  focusDetails?: () => void;
}

// Returns a keydown handler to spread on a focusable container.
export function useHotkeys(targets: HotkeyTargets) {
  const awaitingSecondKey = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onKeyDown: React.KeyboardEventHandler<HTMLElement> = useCallback((e) => {
    const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
    const inInput = tag === 'input' || tag === 'textarea' || tag === 'select';

    if (!inInput && e.key === '/') {
      e.preventDefault();
      targets.focusSearch?.();
      return;
    }

    if (!inInput && e.key.toLowerCase() === 'g') {
      awaitingSecondKey.current = true;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => { awaitingSecondKey.current = false; }, HOTKEY_SEQUENCE_TIMEOUT_MS);
      return;
    }

    if (awaitingSecondKey.current) {
      awaitingSecondKey.current = false;
      if (timer.current) { clearTimeout(timer.current); timer.current = null; }
      if (e.key.toLowerCase() === 'l') { e.preventDefault(); targets.focusList?.(); }
      if (e.key.toLowerCase() === 'd') { e.preventDefault(); targets.focusDetails?.(); }
    }
  }, [targets.focusSearch, targets.focusList, targets.focusDetails]);

  return { onKeyDown } as const;
}
