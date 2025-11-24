// src/types/react-window.d.ts
import * as React from 'react';

export interface ListChildComponentProps<T = unknown> {
  index: number;
  style: React.CSSProperties;
  data: T;
}

export interface FixedSizeListProps<T = unknown> {
  height: number;
  width: number | string;
  itemCount: number;
  itemSize: number;
  itemData?: T;
  className?: string;
  children: React.ComponentType<ListChildComponentProps<T>>;
  onScroll?: (props: {
    scrollDirection: 'forward' | 'backward';
    scrollOffset: number;
    scrollUpdateWasRequested: boolean;
  }) => void;
}

export class FixedSizeList<T = unknown> extends React.Component<
  FixedSizeListProps<T>
> {
  scrollToItem(index: number, align?: 'auto' | 'smart' | 'center' | 'end' | 'start'): void;
}

declare module 'react-window' {
  export {
    FixedSizeList,
    FixedSizeListProps,
    ListChildComponentProps
  };
}
