import { findSocketType } from '@/core/process';
import { OnLink } from '@/utils/sockets';

export const stringSocketOnLink: OnLink<any, string> = function (
  update, socket
) {
  const kind = findSocketType(socket);
  if (kind === undefined) return;
  update(() => _ => String(kind.process()))
}
