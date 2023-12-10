import { NodeDataStore } from '@/interfaces/node';
import { NodeSocketData, SocketRef } from '@/interfaces/socket';
import { isDefined } from '@/utils/CommonTools';
import { ReactiveMap } from '@solid-primitives/map';
import { For, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import NodeLink from '../NodeLink/NodeLink';
import { findOutputSocket } from '../NodeSocket/SocketsData';
import { useNodeData } from '../providers/NodesProvider';

export interface Link {
  fromSocket: SocketRef; toSocket: SocketRef;
}

function createLink([id, { fromSocket, toSocket }]: [symbol, Link], nodes: NodeDataStore[]) {
  const toNode = nodes[toSocket.node_id];
  if (toNode === undefined) return;
  const ts = toNode.inputs[toSocket.name];
  if (ts === undefined) return;
  const fs = findOutputSocket(fromSocket);
  if (fs === undefined) return;
  ts.linkSocket[1](fromSocket);
  return { id, fs, ts };
}

function Links(props: {
  collection: ReactiveMap<symbol, Link>;
}) {
  const withNodes = useNodeData();
  const [list, updateList] = createStore<{
    todo: Array<{
      id: symbol
      fs: NodeSocketData
      ts: NodeSocketData
    }>
  }>({ todo: [] });

  createEffect(() => withNodes(nodes => {
    updateList('todo', origin => {
      const checked: symbol[] = [];
      const f2 = origin.map(item => {
        const now = props.collection.get(item.id);
        if (now === undefined) return;
        const n = createLink([item.id, now], nodes);
        if (n === undefined) return;
        item.fs = n.fs
        item.ts = n.ts
        checked.push(item.id)
        return item
      }).filter(isDefined);

      for (const [id, item] of props.collection) {
        if (checked.includes(id)) continue;
        const now = createLink([id, item], nodes)
        if (now === undefined) continue;
        f2.push(now)
      }
      return f2;
    })

  }))

  console.info('[Render]::Links Render');

  return <div>
    <For each={list.todo}>
      {item => <NodeLink id={item.id} fromSocket={item.fs} toSocket={item.ts} />}
    </For>
  </div>
}

export default Links;
