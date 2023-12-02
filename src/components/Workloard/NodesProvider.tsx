import {
  ParentProps,
  createSignal,
} from 'solid-js';
import { NodeDataStore, NodesData } from './NodesData';
import NodeAdd, { NodeAddDraw } from '@/nodes/NodeAdd';
import NodeLabel, { NodeLabelDraw } from '@/nodes/NodeLabel';

function NodesProvider(props: ParentProps) {
  const store: NodeDataStore[] = [
    {
      // TODO: 这里要用signal更新组件，触发细粒度更新
      Com: NodeAddDraw,
      kind: new NodeAdd(),
      transform: createSignal({ left: 100, top: 10 }),
    },
    {
      Com: NodeAddDraw,
      kind: new NodeAdd(),
      transform: createSignal({ left: 140, top: 160 }),
    },
    {
      Com: NodeLabelDraw,
      kind: new NodeLabel(),
      transform: createSignal({ left: 200, top: 300 }),
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
