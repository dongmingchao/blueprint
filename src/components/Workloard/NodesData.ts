import { Location2D, PureComponent } from '@/interfaces/node';
import {
  createContext,
  Accessor,
  Signal,
  ParentProps,
  createMemo,
  useContext,
} from 'solid-js';
import { NodeIndex } from './IndexData';

export type Accessify<T> = {
  [key in keyof T]: Accessor<T[key]>;
};

export interface NodeDataStore {
  Com: PureComponent;
  transform: Signal<Location2D>;
}

export function useNodeData() {
  const nodesData = useContext(NodesData);
  const node_id = useContext(NodeIndex);
  return <R>(apply: (node: NodeDataStore) => R) => {
    if (nodesData === undefined) return;
    if (node_id === undefined) return;
    const d = nodesData[node_id];
    if (d === undefined) return;
    return apply(d);
  };
}

export const NodesData = createContext<NodeDataStore[]>([], {
  name: 'node data',
});

export interface NodesProviderProps extends ParentProps {}

export class NodeType {
  static mark = Symbol();
  static get marks() {
    return [this.mark];
  }

  isInstanceOf(maybe: typeof NodeType) {
    return (
      (this.constructor as typeof NodeType).marks.indexOf(maybe.mark) !== -1
    );
  }

  children(): PureComponent {
    return () => undefined;
  }
}
