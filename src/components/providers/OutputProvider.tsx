import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { StoreReturn } from '@/utils/props';
import { createContext } from "solid-js";
import { createStore } from 'solid-js/store';
import { ParentProps } from 'solid-js/types/server/rendering.js';

export const OutputsPost = createContext<StoreReturn<{
  [P in number]?: {
    [K in (keyof any)]?: OutputSocketType
  }
}>>();

function OutputsProvider(props: ParentProps) {
  return <OutputsPost.Provider value={createStore({})}>
    {props.children}
  </OutputsPost.Provider>
}

export default OutputsProvider;
