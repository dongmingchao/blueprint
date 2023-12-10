import { SocketsChannel } from '@/interfaces/socket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { useCurrentNodeData } from '@/components/providers/NodesProvider';
import { SocketRef } from '@/interfaces/socket';
import {
  Accessor,
  Component,
  Setter,
  createEffect,
  createMemo,
  createSignal,
  on,
} from 'solid-js';

function useIsSocketLinked(name: keyof any, input: SocketsChannel = 'inputs') {
  const withNode = useCurrentNodeData();
  return createMemo(() => {
    return (
      withNode(node => {
        const socket = node[input][name];
        if (socket) {
          const [is_linked] = socket.linkSocket;
          return is_linked() !== undefined;
        }
      }) ?? false
    );
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
      isLinked: useIsSocketLinked(props.name, kind),
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
  const [func, setFunc] = createSignal<(prev?: T) => T>();
  const [value, pValue] = createSignal<T | undefined>(defaultValue);
  const withNode = useCurrentNodeData();

  createEffect(() => {
    const updater = func();
    if (updater === undefined) return;
    pValue(updater);
  });

  const data = createMemo(() => {
    return withNode(node => node.inputs[name]);
  });

  const link = createMemo(
    on(
      data,
      () => {
        const currentSocket = data();
        if (currentSocket === undefined) return;
        return currentSocket.linkSocket[0];
      },
      { defer: true },
    ),
  );

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
