import { OperatorSocket } from '@/core/operators';
import { SocketRef, SocketsChannel } from '@/interfaces/socket';
import TouchOverProvider from '@/utils/TouchOverProvider';
import { whenNotUndefined } from '@/utils/props';
import { Segment } from '@flatten-js/core';
import { Accessor, ParentProps, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { useCurrentNodeData } from './NodesProvider';

export interface OperatorProps {
  dragSocket: Accessor<OperatorSocket | undefined>
  hoverSocket: Accessor<OperatorSocket | undefined>
  isDrawing: Accessor<boolean>
}

export interface OperatorData {
  op: OperatorProps
  geometry: {
    links: Record<symbol, Accessor<Segment>>
  }
  elRef: {
    inputs: Map<HTMLDivElement, OperatorSocket>
    outputs: Map<HTMLDivElement, OperatorSocket>
  }
  setDragSocket(value?: OperatorSocket): void
  setHoverSocket(value?: OperatorSocket): void
}

const OperatorsData = createContext<OperatorData>();

function OperatorsProvider(props: ParentProps) {
  const [dragSocket, setDragSocket] = createSignal<OperatorSocket>();
  const [hoverSocket, setHoverSocket] = createSignal<OperatorSocket>();

  const store: OperatorData = {
    op: {
      dragSocket,
      hoverSocket,
      isDrawing() { return false },
    },
    geometry: { links: {} },
    elRef: {
      inputs: new Map(),
      outputs: new Map(),
    },
    setDragSocket,
    setHoverSocket,
  }

  return (
    <TouchOverProvider>
      <OperatorsData.Provider value={store}>
        {props.children}
      </OperatorsData.Provider>
    </TouchOverProvider>
  )
}

export default OperatorsProvider;

export function useOperatorsData() {
  return whenNotUndefined(useContext(OperatorsData));
}

export function dispatchSetDragSocket() {
  const withOperatorsData = useOperatorsData();
  const withNode = useCurrentNodeData();

  return function (name: keyof any, channel: SocketsChannel) {
    withOperatorsData(operators => {
      withNode((node, id) => {
        const socketRef: SocketRef = { node_id: id, name }
        const data = node[channel][socketRef.name];
        if (data === undefined) return;
        operators.setDragSocket({
          ref: socketRef,
          data,
        })
      })
    })
  }
}

export function dispatchOperatorAddSocket(
  name: keyof any,
  socket: Accessor<undefined | HTMLDivElement>,
  channel: SocketsChannel,
) {
  const withNode = useCurrentNodeData();
  const withOperatorsData = useOperatorsData();

  createEffect(() => {
    withOperatorsData(data => {
      const so = socket();
      if (so === undefined) return;
      withNode((node, node_id) => {
        const value = node[channel][name];
        if (value === undefined) return;
        const { elRef } = data;
        const dict = elRef[channel];
        dict.set(so, {
          ref: { node_id, name },
          data: value,
        });
      });
    });
  })
}
