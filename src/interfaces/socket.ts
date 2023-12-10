import { Location2D } from '@/interfaces/node';
import { Accessor, Signal } from 'solid-js';
import { NodeDataStore } from '@/interfaces/node';

export interface NodeSocketData {
  pinPosition: Accessor<Location2D | undefined>;
  node: NodeDataStore;
  linkSocket: Signal<SocketRef | undefined>;
  el: HTMLDivElement;
  updatePinPosition: () => undefined;
}

export interface SocketCollection {
  [K: symbol | string | number]: NodeSocketData;
}

export interface SocketValue {
  outputs: SocketCollection;
  inputs: SocketCollection;
}

export interface SocketRef {
  node_id: number;
  name: keyof any;
}

export type SocketsChannel = keyof SocketValue;
