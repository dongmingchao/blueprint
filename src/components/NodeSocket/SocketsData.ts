import { SocketRef } from '@/interfaces/socket';
import { VectorType } from '../../core/VectorBaseType';
import { useNodeData } from '../providers/NodesProvider';

export function findOutputSocket(by?: SocketRef) {
  if (by === undefined) return;
  const withNode = useNodeData();
  return withNode(nodes => {
    const fromValue = nodes[by.node_id];
    if (fromValue === undefined) return;
    return fromValue.outputs[by.name];
  });
}

export class OutputSocketType extends VectorType {
  process(): void {}
}
