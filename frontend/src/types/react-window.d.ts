// src/types/react-window.d.ts
import * as React from 'react';

export interface ListChildComponentProps<T = any> {
  index: number;
  style: React.CSSProperties;
  data: T;
}

export interface FixedSizeListProps<T = any> {
  height: number;
  width: number | string;
  itemCount: number;
  itemSize: number;
  itemData?: T;
  className?: string;
  children: React.ComponentType<ListChildComponentProps<T>>;
}

export class FixedSizeList<T = any> extends React.Component<
  FixedSizeListProps<T>
> {}

declare module 'react-window' {
  export {
    FixedSizeList,
    FixedSizeListProps,
    ListChildComponentProps
  };
}
