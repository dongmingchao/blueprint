import {
  Props as NodeSocketProps,
  useValuesData,
} from '@/components/NodeSocket/NodeSocket';
import {
  NodeSocketData,
  OutputSocketType,
  SocketRef,
  ValuesData,
} from '@/components/NodeSocket/SocketsData';
import { NodeIndex } from '@/components/Workloard/IndexData';
import {
  Accessor,
  Component,
  Setter,
  createEffect,
  createMemo,
  createSignal,
  useContext
} from 'solid-js';

export function isSocketLinked(
  name: keyof any,
  input: 'input' | 'output' = 'input',
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
  kind: 'input' | 'output',
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
  const values = useContext(ValuesData);
  const node_id = useContext(NodeIndex);
  const [func, setFunc] = createSignal<(prev?: T) => T>();
  const [value, pValue] = createSignal<T | undefined>(defaultValue);

  createEffect(() => {
    const updater = func();
    if (updater === undefined) return;
    pValue(updater);
  });

  const data = createMemo(() => {
    if (node_id === undefined) return;
    const node = values[node_id];
    if (node === undefined) return;
    const [inputs] = node.input;
    return inputs[name];
  });

  createEffect(() => {
    if (onLinked === undefined) return;
    let currentSocket: NodeSocketData | undefined = data();
    if (currentSocket) {
      const [link] = currentSocket.linkSocket;
      console.log('link update')
      const lastSocket = link();
      if (lastSocket === undefined) {
        setFunc();
      } else {
        onLinked(setFunc, lastSocket);
      }
    }
  })

  // createEffect(
  //   on(
  //     data,
  //     () => {
  //       let currentSocket: NodeSocketData | undefined = data();
  //       if (currentSocket) {
  //         const [link] = currentSocket.linkSocket;
  //         console.log('link update')
  //         const lastSocket = link();
  //         const pp = process(lastSocket);
  //         onLinked?.(setFunc, pp);
  //       }
  //     },
  //     { defer: true },
  //   ),
  // );

  return {
    value: [value, pValue] as [Accessor<T>, Setter<T>],
    data,
  };
}
