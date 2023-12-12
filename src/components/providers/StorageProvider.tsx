import { SerializableNode } from '@/core/register';
import { storage } from '@/core/storage';
import { Location2D } from '@/interfaces/node';
import { makePersisted } from '@solid-primitives/storage';
import { createResource } from 'solid-js';
import { createStore, produce } from 'solid-js/store';

// type AddFn = (id: symbol, node: SerializableNode) => void;
// type RemoveFn = (id: symbol) => void;

// const addEventMan = createContext<Map<symbol, AddFn>>(new Map());
// const removeEventMan = createContext<Map<symbol, RemoveFn>>(new Map());

export function useSaveNode() {
  const [saved2] = createResource(async () => {
    const ret = await storage.getItem('nodes')
    if (ret) return JSON.parse(ret) as SerializableNode[]
  });
  const [, updateSaved] = makePersisted(
    createStore<SerializableNode[]>([]),
    {
      name: 'nodes',
      storage,
    },
  );

  // const addEvents = useContext(addEventMan);
  // const removeEvents = useContext(removeEventMan);
  // const dispatcherId = Symbol();

  // function produceAdd(id: symbol, node: SerializableNode) {
  //   addEvents.forEach(cv => cv(id, node))
  // }

  // function produceRemove(id: symbol) {
  //   removeEvents.forEach(cv => cv(id))
  // }

  // onCleanup(() => {
  //   addEvents.delete(dispatcherId)
  //   removeEvents.delete(dispatcherId)
  // })

  return {
    // id: dispatcherId,
    // onAdd(when: AddFn) {
    //   addEvents.set(dispatcherId, when);
    // },
    // onRemove(when: RemoveFn) {
    //   removeEvents.set(dispatcherId, when);
    // },
    getAll: saved2,
    add(node: SerializableNode) {
      // const id = Symbol();
      // produceAdd(id, node);
      updateSaved(produce(data => {
        data.push(node);
      }))
    },
    remove(id: number[]) {
      // produceRemove(id);
      updateSaved(data => {
        return data.filter((_, i) => !id.includes(i))
      })
    },
    transform(id: number, location: Location2D) {
      updateSaved(id, 'transform', location)
    }
  }
}
