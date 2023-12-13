import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { findSocketType } from '@/core/process';
import { OnLink } from '@/utils/sockets';
import { createSignal } from 'solid-js';

export const stringSocketOnLink: OnLink<string> = function (
  update, socket
) {
  const kind = findSocketType(socket);
  if (kind === undefined) return;
  update(() => _ => String(kind.process()))
}

export class StringOutput extends OutputSocketType {
  value = createSignal('')
  process(): string {
    return this.value[0]()
  }
}
