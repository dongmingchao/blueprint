import { OutputSocketType, SocketRef } from '@/components/NodeSocket/SocketsData';
import { useContext } from 'solid-js';
import { OutputsPost } from './OutputProvider';

export function findSocketType(socket: SocketRef): OutputSocketType | undefined {
  const outputs = useContext(OutputsPost);
  if (outputs === undefined) return;
  const [o] = outputs;
  return o[socket.node_id]?.[socket.name];
}
