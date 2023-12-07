import { createContext, ParentProps, Accessor, createSignal, Setter } from 'solid-js';
import { OperatorSocket } from '@/core/operators';
import { Segment } from '@flatten-js/core';
import TouchOverProvider from '@/utils/TouchOverProvider';

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
  setDragSocket: Setter<OperatorSocket | undefined>
  setHoverSocket: Setter<OperatorSocket | undefined>
}

export const OperatorsData = createContext<OperatorData>();

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
