import { NodeAddDraw } from '@/nodes/NodeAdd';
import { NodeLabelDraw } from '@/nodes/NodeLabel';
import {
  ParentProps,
  createSignal,
} from 'solid-js';
import { NodeDataStore, NodesData } from './NodesData';
import NodeString from '@/nodes/NodeString';

function NodesProvider(props: ParentProps) {
  const store: NodeDataStore[] = [
    {
      // TODO: 这里要用signal更新组件，触发细粒度更新
      Com: NodeAddDraw,
      transform: createSignal({ left: 100, top: 10 }),
    },
    {
      Com: NodeAddDraw,
      transform: createSignal({ left: 140, top: 160 }),
    },
    {
      Com: NodeLabelDraw,
      transform: createSignal({ left: 200, top: 300 }),
    },
    {
      Com: NodeString,
      transform: createSignal({ left: 200, top: 400 }),
    },
  ];

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
