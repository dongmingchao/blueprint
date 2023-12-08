import { createContext, useContext } from 'solid-js';
import { StoreReturn } from '@/utils/props';
import { Location2D } from '@/interfaces/node';
import { Accessor, Signal } from 'solid-js';
import { VectorType } from '../Workloard/NodesData';
import { NodeDataStore } from '@/interfaces/node';
import { NodeIndex } from '../Workloard/IndexData';

export const SocketsData = createContext<SocketCollection>();

export interface SocketCollection
  extends StoreReturn<
    {
      [K in symbol | string | number]: NodeSocketData;
    }
  > {}

export interface NodeSocketData {
  pinPosition: Accessor<Location2D | undefined>;
  node: NodeDataStore;
  linkSocket: Signal<SocketRef | undefined>;
  el: HTMLDivElement;
  updatePinPosition: () => undefined;
}

export interface SocketValue {
  outputs: SocketCollection;
  inputs: SocketCollection;
}

export const ValuesData = createContext<SocketValue[]>([], {
  name: 'socket values',
});

export function useValuesData() {
  const values = useContext(ValuesData);
  const node_id = useContext(NodeIndex);
  if (values && node_id !== undefined) {
    return values[node_id];
  }
}

export interface SocketRef {
  node_id: number;
  name: keyof any;
}

export function findOutputSocket(by?: SocketRef) {
  if (by === undefined) return;
  const values = useContext(ValuesData);
  const fromValue = values[by.node_id];
  if (fromValue === undefined) return;
  const [output] = fromValue.outputs;
  return output[by.name];
}

export class OutputSocketType extends VectorType {
  process(): void {}
}
