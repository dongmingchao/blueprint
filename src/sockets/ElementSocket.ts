import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { JSX, createSignal } from 'solid-js';

export class ElementOutput extends OutputSocketType {
  value = createSignal<JSX.Element>()
  process(): JSX.Element {
    return this.value[0]()
  }
}
