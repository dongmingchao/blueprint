import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { SocketRef } from '@/interfaces/socket';
import { useContext } from 'solid-js';
import { OutputsPost } from '../components/providers/OutputProvider';

export function findSocketType(
  socket: SocketRef,
): OutputSocketType | undefined {
  const outputs = useContext(OutputsPost);
  if (outputs === undefined) return;
  const [o] = outputs;
  return o[socket.node_id]?.[socket.name];
}
