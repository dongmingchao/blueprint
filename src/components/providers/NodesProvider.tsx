import { SerializableNode, createNodesData } from '@/core/register';
import { Location2D, NodeDataStore } from '@/interfaces/node';
import { NodeSocketData, SocketRef, SocketsChannel } from '@/interfaces/socket';
import { StoreReturn } from '@/utils/props';
import {
  Accessor,
  ParentProps, createContext, createEffect, createSignal, onMount, useContext
} from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { useNodeIndex } from '../Workloard/Nodes';
import { dispatchOperatorAddSocket } from './OperatorsProvider';
import { useSaveNode } from './StorageProvider';

function NodesProvider(props: ParentProps) {
  const store = createStore<NodeDataStore[]>([]);
  restoreNodes(store)

  console.info('[Render]::NodesProvider Render')

  return (
    <div>NodesProvider
      <NodesData.Provider value={store}>
        {props.children}
      </NodesData.Provider>
    </div>
  )
}

export default NodesProvider;

export function useNode() {
  const nodesData = useContext(NodesData);
  return function <R>(apply: (node: StoreReturn<NodeDataStore[]>) => R) {
    if (nodesData === undefined) return;
    return apply(nodesData);
  };
}

export function restoreNodes(store: StoreReturn<NodeDataStore[]>) {
  const { getAll } = useSaveNode()

  createEffect(() => {
    if (getAll.loading || getAll.error) return;
    const data = getAll();
    if (data === undefined) return;
    const [, setStore] = store;
    setStore(data.map(createNodesData))
  })
}

export function dispatchAddNode() {
  const withNodeStore = useNode();
  const { add } = useSaveNode();
  return function (ser: SerializableNode) {
    withNodeStore(store => {
      const data = createNodesData(ser);
      const [, setStore] = store;
      setStore(produce(s => {
        s.push(data);
      }))
      add(ser)
    })
  }
}

export function dispatchRegisterSocket(
  body: Accessor<HTMLDivElement | undefined>,
  pin: Accessor<SVGSVGElement | undefined>,
  name: keyof any,
  channel: SocketsChannel,
) {
  const [pinPosition, setPinPosition] = createSignal<Location2D>();
  const linkSocket = createSignal<SocketRef>();
  const withNode = useCurrentNodeData()
  const withNodeStore = useNode();
  dispatchOperatorAddSocket(name, body, channel)

  createEffect(() => {
    /**
     * 自动在使用组件时注册socket数据
     */
    const el = body();
    if (el === undefined) return;
    withNodeStore(store => {
      const [, set] = store;
      withNode((node, id) => {
        const newSocket: NodeSocketData = {
          pinPosition,
          node,
          linkSocket,
          el,
          updatePinPosition,
        }
        set(id, channel, name, newSocket)
      })
    })
  })

  function updatePinPosition(): undefined {
    const el = pin()
    if (el) {
      const box = el.getBoundingClientRect();
      setPinPosition({
        left: box.left,
        top: box.top,
      });
    }
  }

  onMount(() => {
    updatePinPosition()
  })
}

export function useNodeData() {
  const withNodeStore = useNode();
  function ret(): NodeDataStore[] | undefined;
  function ret<R>(apply: (node: NodeDataStore[]) => R): R | undefined;
  function ret<R>(apply?: (node: NodeDataStore[]) => R) {
    return withNodeStore(store => {
      if (apply) return apply(store[0])
      return store[0]
    })
  };
  return ret
}

export function dispatchSetNodeTransform() {
  const withNodeStore = useNode();
  const withNodeIndex = useNodeIndex();
  const { transform } = useSaveNode();
  return function (location: Location2D) {
    withNodeStore(store => {
      const [, set] = store
      withNodeIndex(id => {
        set(id, 'transform', () => () => location)
        transform(id, location)
      })
    })
  }
}

export function useCurrentNodeData() {
  const withNodes = useNodeData();
  const withNodeIndex = useNodeIndex();
  return function <R>(apply: (node: NodeDataStore, id: number) => R) {
    return withNodes(nodes => {
      return withNodeIndex(id => {
        const item = nodes[id];
        if (item === undefined) return;
        return apply(item, id);
      })
    });
  };
}

const NodesData = createContext<StoreReturn<NodeDataStore[]>>(undefined, {
  name: 'node data',
});

export interface NodesProviderProps extends ParentProps { }

