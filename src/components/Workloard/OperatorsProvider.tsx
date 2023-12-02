import { createContext, ParentProps, Accessor } from 'solid-js';
import { StoreReturn } from '@/utils/props';
import { createStore } from 'solid-js/store';
import { OperatorSocket } from '@/core/operators';
import { Segment } from '@flatten-js/core';

export interface OperatorProps {
  dragSocket?: OperatorSocket
  hoverSocket?: OperatorSocket
  isDrawing?: boolean
}

export interface OperatorData {
  op: StoreReturn<OperatorProps>
  geometry: {
    links: Record<symbol, Accessor<Segment>>
  }
}

export const OperatorsData = createContext<OperatorData>();

function OperatorsProvider(props: ParentProps) {
  const store: OperatorData = {
    op: createStore({}),
    geometry: { links: {} }
  }

  return (
    <OperatorsData.Provider value={store}>
      {props.children}
    </OperatorsData.Provider>
  )
}

export default OperatorsProvider;
