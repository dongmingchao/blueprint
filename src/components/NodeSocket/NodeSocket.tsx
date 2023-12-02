import { OperatorSocket } from '@/core/operators';
import { Location2D } from '@/interfaces/node';
import { whenNotUndefined } from '@/utils/props';
import {
  ParentProps,
  Ref,
  createEffect,
  createSignal,
  on,
  onCleanup,
  splitProps,
  useContext
} from 'solid-js';
import { NodeIndex } from '../Workloard/IndexData';
import { NodesData, whenNode } from '../Workloard/NodesData';
import { OperatorProps, OperatorsData } from '../Workloard/OperatorsProvider';
import css from './NodeSocket.module.styl';
import { NodeSocketData, SocketRef, SocketsData, ValuesData } from './SocketsData';

export interface Props extends ParentProps {
  class?: string;
  ref?: Ref<SVGSVGElement>;
  name: keyof any;
}

export function useValuesData() {
  const values = useContext(ValuesData);
  const node_id = useContext(NodeIndex);
  if (values && node_id !== undefined) {
    return values[node_id];
  }
}

function NodeSocket(props: Props) {
  const node_id = useContext(NodeIndex);
  const nodesData = useContext(NodesData);
  const socketsData = useContext(SocketsData);
  const [pinPosition, setPinPosition] = createSignal<Location2D>();
  const linkSocket = createSignal<SocketRef>();
  const useSocketsData = whenNotUndefined(socketsData);
  const useOperatorsData = whenNotUndefined(useContext(OperatorsData))
  console.info('[Render]::NodeSocket Render');

  function classNames() {
    let c = [css.socket];
    if (props.class) c.push(props.class);
    return c.join(' ');
  }

  createEffect(() => {
    /**
     * 自动在使用组件时注册socket数据
     */
    if (node_id === undefined) return;
    const node = nodesData[node_id];
    if (node === undefined) return;
    if (socketsData === undefined) return;
    const newSocket: NodeSocketData = {
      pinPosition,
      node,
      linkSocket,
    }
    const [, upd] = socketsData;
    upd({ [props.name]: newSocket })
  })

  const node_t = whenNode(node => {
    return node.transform[0]()
  })

  createEffect(() => {
    const [{ ref }] = splitProps(props, ['ref']);
    if (ref === undefined) return;
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.target.getBoundingClientRect();
        setPinPosition({
          left: cr.left,
          top: cr.top,
        })
      }
    });
    obs.observe(ref as SVGSVGElement);
    onCleanup(() => {
      obs.disconnect()
    })
  })

  createEffect(on(node_t, () => {
    const ref = props.ref as SVGSVGElement;
    if (props.ref) {
      const box = ref.getBoundingClientRect();
      setPinPosition({
        left: box.left,
        top: box.top,
      });
    }
  }, { defer: true }));

  function useSocket(apply: (arg0: OperatorSocket) => void) {
    if (node_id === undefined) return;
    useSocketsData(sd => {
      const [sockets] = sd;
      const self = sockets[props.name];
      if (self === undefined) return;
      apply({
        data: self,
        ref: {
          node_id, name: props.name,
        }
      });
    })
  }

  const onTouchPress = (e: PointerEvent) => {
    useSocket(self => {
      useOperatorsData(operators => {
        const [, upd] = operators.op;
        const d: OperatorProps = { dragSocket: self };
        upd(d);
      })
      e.preventDefault()
      e.stopPropagation()
    })
  }

  function onTouchEnter(e: PointerEvent) {
    useSocket(self => {
      useOperatorsData(op => {
        const [, upd] = op.op;
        const d: OperatorProps = { hoverSocket: self };
        upd(d);
      })
    })
  }

  function onTouchLeave(e: PointerEvent) {
    useOperatorsData(op => {
      const [, upd] = op.op;
      const d: OperatorProps = { hoverSocket: undefined };
      upd(d);
    })
  }

  return (
    <div
      onPointerOver={onTouchEnter}
      onPointerOut={onTouchLeave}
      class={classNames()}>
      <svg onPointerDown={onTouchPress}
        ref={props.ref}
        class={css.pin}
        width="15" height="15">
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="white"
          stroke-width="2"
          fill="#acd"
        />
      </svg>
      {props.children}
    </div>
  );
}

export default NodeSocket;
