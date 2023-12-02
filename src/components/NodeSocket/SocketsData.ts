import { createContext, useContext } from 'solid-js';
import { StoreReturn } from '@/utils/props';
import { Location2D } from '@/interfaces/node';
import { Accessor, Signal } from 'solid-js';
import { NodeDataStore, NodeType } from '../Workloard/NodesData';

export const SocketIndex = createContext<number>();

export const SocketsData = createContext<SocketCollection>();

export interface SocketCollection<T extends NodeType = NodeType>
  extends StoreReturn<
    {
      [K in symbol | string | number | keyof T]?: NodeSocketData<T>;
    }
  > {}

export interface NodeSocketData<NodeKind extends NodeType = NodeType> {
  pinPosition: Accessor<Location2D | undefined>;
  node: NodeDataStore<NodeKind>;
  linkSocket: Signal<SocketRef | undefined>;
}

export const ValuesData = createContext<
  Array<{
    output: SocketCollection;
    input: SocketCollection;
  }>
>([], { name: 'socket values' });

export interface SocketRef {
  node_id: number;
  name: keyof any;
}

export function findOutputSocket(by?: SocketRef) {
  if (by === undefined) return;
  const values = useContext(ValuesData);
  const fromValue = values[by.node_id];
  if (fromValue === undefined) return;
  const [output] = fromValue.output;
  return output[by.name];
}

export class OutputSocketType extends NodeType {
  process(): void {};
}
