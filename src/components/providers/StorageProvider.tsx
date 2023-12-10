import { SerializableNode } from '@/core/register';
import { createContext, onCleanup, useContext } from 'solid-js';

export const storageNode: SerializableNode[] = [{
  importedKind: 'NodeAdd',
  transform: { left: 100, top: 10 }
}, {
  importedKind: 'NodeAdd',
  transform: { left: 200, top: 160 },
}, {
  importedKind: 'NodeLabel',
  transform: { left: 100, top: 300 },
}, {
  importedKind: 'NodeString',
  transform: { left: 200, top: 400 },
}];

const SaveNode = createContext<Map<symbol, SerializableNode>>(new Map());

type AddFn = (id: symbol, node: SerializableNode) => void;
type RemoveFn = (id: symbol) => void;

const addEventMan = createContext<Map<symbol, AddFn>>(new Map());
const removeEventMan = createContext<Map<symbol, RemoveFn>>(new Map());

export function useSaveNode() {
  const data = useContext(SaveNode);
  const addEvents = useContext(addEventMan);
  const removeEvents = useContext(removeEventMan);
  const dispatcherId = Symbol();

  function produceAdd(id: symbol, node: SerializableNode) {
    addEvents.forEach(cv => cv(id, node))
  }

  function produceRemove(id: symbol) {
    removeEvents.forEach(cv => cv(id))
  }

  onCleanup(() => {
    addEvents.delete(dispatcherId)
    removeEvents.delete(dispatcherId)
  })

  return {
    id: dispatcherId,
    onAdd(when: AddFn) {
      addEvents.set(dispatcherId, when);
    },
    onRemove(when: RemoveFn) {
      removeEvents.set(dispatcherId, when);
    },
    add(node: SerializableNode) {
      const id = Symbol();
      produceAdd(id, node);
      data.set(id, node);
    },
    remove(id: symbol) {
      produceRemove(id);
      data.delete(id);
    },
    has(id: symbol) {
      return data.has(id)
    },
  }
}
