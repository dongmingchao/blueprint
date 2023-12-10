import type { Accessor, JSX } from 'solid-js';
import { SocketValue } from './socket';

export interface Location2D {
  left: number;
  top: number;
}

export function add(a: Location2D, b: Location2D): Location2D {
  return {
    left: a.left + b.left,
    top: a.top + b.top,
  };
}

export type PureComponent = () => JSX.Element;

export interface NodeDataStore extends SocketValue {
  Com: PureComponent;
  transform: Accessor<Location2D>;
}

export type Accessify<T> = {
  [key in keyof T]: Accessor<T[key]>;
};
