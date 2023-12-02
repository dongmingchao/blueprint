import { JSX, createEffect, useContext, createSignal } from 'solid-js';
import { ValuesData, findOutputSocket } from '../NodeSocket/SocketsData';
import { SocketRef } from '../NodeSocket/SocketsData';
import NodeLink from '../NodeLink/NodeLink';
import { ReactiveMap } from '@solid-primitives/map';

export interface Link {
  fromSocket: SocketRef; toSocket: SocketRef;
}

function Links(props: {
  collection: ReactiveMap<symbol, Link>;
}) {
  const values = useContext(ValuesData);
  const [renders, setRenders] = createSignal<JSX.Element[]>([]);

  createEffect(() => {
    const linksRender: JSX.Element[] = [];
    for (const [id, { fromSocket, toSocket }] of props.collection) {
      const toNode = values[toSocket.node_id];
      if (toNode === undefined) continue;
      const [input] = toNode.input;
      const ts = input[toSocket.name];
      if (ts === undefined) continue;
      console.log('update links', fromSocket, toSocket);
      const fs = findOutputSocket(fromSocket);
      if (fs === undefined) return;
      ts.linkSocket[1](fromSocket);
      linksRender.push(<NodeLink id={id} fromSocket={fs} toSocket={ts} />);
    }
    setRenders(linksRender);
  });

  console.info('[Render]::Links Render');

  return <div>{renders as unknown as JSX.Element}</div>
}

export default Links;
