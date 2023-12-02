import { NodeSocketData, OutputSocketType, SocketRef } from '@/components/NodeSocket/SocketsData';
import { NodeType } from '@/components/Workloard/NodesData';
import { OutputsPost } from './OutputProvider';
import { useContext } from 'solid-js';

export interface NamedNodeSocket<NodeKind extends NodeType = NodeType>
  extends NodeSocketData<NodeKind> {
  name: keyof NodeKind;
}

export function findSocketType(socket: SocketRef): OutputSocketType | undefined {
  const outputs = useContext(OutputsPost);
  if (outputs === undefined) return;
  const [o] = outputs;
  return o[socket.node_id]?.[socket.name];
}
