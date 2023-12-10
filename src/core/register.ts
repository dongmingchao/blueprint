import { Location2D, NodeDataStore } from '@/interfaces/node';
import { JSX, lazy } from 'solid-js';
import * as nodes from '../nodes';

export interface SerializableNode {
  transform: Location2D;
  importedKind: keyof typeof nodes;
}

export function createNodesData(data: SerializableNode): NodeDataStore {
  return {
    Com: lazy(() => nodes[data.importedKind].catch(error => {
      return {
        default(): JSX.Element {
          return error
        }
      }
    })),
    transform: () => data.transform,
    inputs: {},
    outputs: {},
  };
}

