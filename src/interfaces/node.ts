import type { JSX } from 'solid-js';

export interface Location2D {
  left: number;
  top: number;
}

export function add(a: Location2D, b: Location2D): Location2D {
  return {
    left: a.left + b.left,
    top: a.top + b.top,
  }
}

export interface SocketData {
  label: string;
}

export type PureComponent = () => JSX.Element;
