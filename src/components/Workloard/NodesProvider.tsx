import { NodeDataStore } from '@/interfaces/node';
import {
  ParentProps} from 'solid-js';
import { NodesData } from './NodesData';
import { SerializableNode, createNodesData } from '@/core/register';

const storageNode: SerializableNode[] = [{
  importedKind: '/src/nodes/NodeAdd',
  transform: { left: 100, top: 10 }
}, {
  importedKind: '/src/nodes/NodeAdd',
  transform: { left: 200, top: 160 },
}, {
  importedKind: '/src/nodes/NodeLabel',
  transform: { left: 100, top: 300 },
}, {
  importedKind: '/src/nodes/NodeString',
  transform: { left: 200, top: 400 },
}]

function NodesProvider(props: ParentProps) {
  // const [signal, setSignal] = makePersisted(
  //   createSignal<Location2D[]>([]),
  //   {
  //     name: 'nodes',
  //     storage: mystore,
  //   },
  // );


  const store: NodeDataStore[] = [
    // {
    //   // TODO: 这里要用signal更新组件，触发细粒度更新
    //   Com: NodeAddDraw,
    //   transform: createSignal({ left: 100, top: 10 }),
    // },
    // {
    //   Com: NodeAddDraw,
    //   transform: createSignal({ left: 140, top: 160 }),
    // },
    // {
    //   Com: NodeLabelDraw,
    //   transform: createSignal({ left: 200, top: 300 }),
    // },
    // {
    //   Com: NodeString,
    //   transform: createSignal({ left: 200, top: 400 }),
    // },
    ...storageNode.map(createNodesData)
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
