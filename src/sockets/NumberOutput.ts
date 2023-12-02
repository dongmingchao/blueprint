import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { OutputsPost } from '@/core/OutputProvider';
import { findSocketType } from '@/core/process';
import { OnLink } from '@/utils/sockets';
import { createSignal, useContext } from 'solid-js';

class NumberSocket extends OutputSocketType {
  value = createSignal(0)
  process(): number {
    return this.value[0]();
  }
}

export default NumberSocket;

export const numberSocketOnLink: OnLink<NumberSocket> = function (update, socket) {
  const kind = findSocketType(socket);
  if (kind === undefined) return;
  if (kind instanceof NumberSocket) {
    update(() => _prev => kind.process());
  }
};
