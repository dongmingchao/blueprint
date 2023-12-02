import { For, useContext } from 'solid-js';
import { NodesData } from './NodesData';
import { NodeIndex } from './IndexData';

function Nodes() {
  const data = useContext(NodesData);
  console.info('[Render]::Nodes Render');

  return (
    <div>
      <For each={data}>
        {(Item, id) => (
          <NodeIndex.Provider value={id()}>
            <Item.Com />
          </NodeIndex.Provider>
        )}
      </For>
    </div>
  );
}

export default Nodes;
