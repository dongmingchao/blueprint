import { SocketsChannel } from '@/components/NodeSocket/ChannelNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import {
  NodeSocketData,
  OutputSocketType,
  SocketRef, useValuesData
} from '@/components/NodeSocket/SocketsData';
import { NodeIndex } from '@/components/Workloard/IndexData';
import {
  Accessor,
  Component,
  Setter,
  createEffect,
  createMemo,
  createSignal,
  on,
  useContext,
} from 'solid-js';

export function isSocketLinked(
  name: keyof any,
  input: SocketsChannel = 'inputs',
) {
  const inputStore = useValuesData()?.[input];
  return createMemo(() => {
    const socket = inputStore?.[0][name];
    if (socket) {
      const [is_linked] = socket.linkSocket;
      return is_linked() !== undefined;
    }
    return false;
  });
}

/**
 * Inject props.isLinked to NodeSocket Component
 * @param Injected NodeSocket Component
 * @returns Component with props.isLinked Injected
 */
export function injectIsLinked<
  T extends NodeSocketProps & {
    isLinked: Accessor<boolean>;
  }
>(
  Injected: Component<T>,
  kind: SocketsChannel,
): Component<Omit<T, 'isLinked'>> {
  return function (props) {
    return Injected({
      isLinked: isSocketLinked(props.name, kind),
      ...props,
    } as any);
  };
}

export type OnLink<T extends OutputSocketType, P = ReturnType<T['process']>> = (
  update: Setter<((prev?: P) => P) | undefined>,
  socketKind: SocketRef,
) => void;

export function createInputSocket<
  P extends OutputSocketType,
  T = ReturnType<P['process']>
>(name: string, onLinked?: OnLink<P, T>, defaultValue?: T) {
  const node_id = useContext(NodeIndex);
  const [func, setFunc] = createSignal<(prev?: T) => T>();
  const [value, pValue] = createSignal<T | undefined>(defaultValue);
  const node = useValuesData();

  createEffect(() => {
    const updater = func();
    if (updater === undefined) return;
    pValue(updater);
  });

  const data = createMemo(() => {
    if (node === undefined) return;
    const [inputs] = node.inputs;
    return inputs[name];
  });

  const link = createMemo(on(data, () => {
    const currentSocket = data();
    if (currentSocket === undefined) return;
    return currentSocket.linkSocket[0];
  }, { defer: true }))

  createEffect(() => {
    if (onLinked === undefined) return;
    const lsdc = link();
    if (lsdc === undefined) return;
    const lastSocket = lsdc();
    if (lastSocket === undefined) {
      setFunc();
    } else {
      onLinked(setFunc, lastSocket);
    }
  });

  return {
    value: [value, pValue] as [Accessor<T>, Setter<T>],
    data,
  };
}
