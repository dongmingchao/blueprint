import { Accessor, For, createContext, useContext } from 'solid-js';
import { useNodeData } from '../providers/NodesProvider';

const NodeIndex = createContext<Accessor<number>>()

function Nodes() {
  const withNodes = useNodeData();
  const data = withNodes()
  console.info('[Render]::Nodes Render');

  return (
    <div>
      <For each={data}>
        {(Item, id) => (
          <NodeIndex.Provider value={id}>
            <Item.Com />
          </NodeIndex.Provider>
        )}
      </For>
    </div>
  );
}

export default Nodes;

export function useNodeIndex() {
  const id = useContext(NodeIndex);
  return function <R>(apply: (id: number) => R): R|undefined {
    if (id === undefined) return;
    return apply(id())
  }
}
