import { createContext, Accessor, ParentProps, useContext } from 'solid-js';
import { NodeIndex } from './IndexData';
import { NodeDataStore } from '@/interfaces/node';

export type Accessify<T> = {
  [key in keyof T]: Accessor<T[key]>;
};

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
