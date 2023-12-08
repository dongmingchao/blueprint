import { NodeDataStore } from '@/interfaces/node';
import { Location2D } from '@/interfaces/node';
import { createSignal, lazy } from 'solid-js';
import { children } from '../utils/children';
import { Fragment } from 'solid-js/h/jsx-runtime';
const modules = import.meta.glob('@/nodes/*')

export interface SerializableNode {
  transform: Location2D;
  importedKind: string;
}

export function createNodesData(data: SerializableNode): NodeDataStore {
  return {
    Com: lazy(() => import(data.importedKind).catch(error => {
      return {
        default() {
          return Fragment({ children: error })
        }
      }
    })),
    transform: createSignal(data.transform),
  };
}

