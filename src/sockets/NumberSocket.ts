import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { findSocketType } from '@/core/process';
import { OnLink } from '@/utils/sockets';
import { createSignal } from 'solid-js';

export class NumberOutput extends OutputSocketType {
  value = createSignal(0)
  process(): number {
    return this.value[0]();
  }
}

export const numberSocketOnLink: OnLink<number> = function (update, socket) {
  const kind = findSocketType(socket);
  if (kind === undefined) return;
  if (kind instanceof NumberOutput) {
    update(() => _prev => kind.process());
  }
};
