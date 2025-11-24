import { useCallback, useEffect, useRef, useState } from 'react';
import { SCROLL_HINT_AUTOHIDE_MS } from '../constants/ui';

export function useScrollHint({ autoHideMs = SCROLL_HINT_AUTOHIDE_MS }: { autoHideMs?: number } = {}) {
  const [visible, setVisible] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide after a brief moment so it doesn't linger
  useEffect(() => {
    if (!visible) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), autoHideMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [visible, autoHideMs]);

  const markInteracted = useCallback(() => setVisible(false), []);

  // For react-window onScroll
  const onListScroll = useCallback((_: { scrollDirection: 'forward' | 'backward'; scrollOffset: number; scrollUpdateWasRequested: boolean; }) => setVisible(false), []);

  // For wrapper keydown to hide when keys are used
  const onWrapperKeyDown: React.KeyboardEventHandler<HTMLElement> = useCallback(() => setVisible(false), []);

  return { visible, markInteracted, onListScroll, onWrapperKeyDown } as const;
}
