import { SocketRef } from '@/interfaces/socket';
import { NodeSocketData } from '@/interfaces/socket';

export interface OperatorSocket {
  data: NodeSocketData;
  ref: SocketRef;
}
