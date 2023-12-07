import { Location2D } from '@/interfaces/node';
import { whenNotUndefined } from '@/utils/props';
import {
  ParentProps,
  createEffect,
  createRenderEffect,
  createSignal,
  onMount,
  useContext
} from 'solid-js';
import { NodeIndex } from '../Workloard/IndexData';
import { NodesData } from '../Workloard/NodesData';
import { OperatorsData } from '../Workloard/OperatorsProvider';
import css from './NodeSocket.module.styl';
import { NodeSocketData, SocketRef, SocketsData } from './SocketsData';

export interface Props extends ParentProps {
  class?: string;
  name: keyof any;
  refs?: {
    body?(el: HTMLDivElement): void
    pin?(el: SVGSVGElement): void
  }
  updatePinPosition?(f: () => undefined): void;
}

const NodeSocketKind = 'node socket';

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

  let body: undefined | HTMLDivElement;

  createEffect(() => {
    /**
     * 自动在使用组件时注册socket数据
     */
    if (node_id === undefined) return;
    const node = nodesData[node_id];
    if (node === undefined) return;
    if (socketsData === undefined) return;
    if (body === undefined) return;
    const newSocket: NodeSocketData = {
      pinPosition,
      node,
      linkSocket,
      el: body,
      updatePinPosition,
    }
    const [, upd] = socketsData;
    upd({ [props.name]: newSocket })
  })

  // const node_t = useNode(node => {
  //   return node.transform[0]()
  // })

  // createEffect(() => {
  //   const [{ ref }] = splitProps(props, ['ref']);
  //   if (ref === undefined) return;
  //   const obs = new ResizeObserver(entries => {
  //     for (const entry of entries) {
  //       const cr = entry.target.getBoundingClientRect();
  //       setPinPosition({
  //         left: cr.left,
  //         top: cr.top,
  //       })
  //     }
  //   });
  //   obs.observe(ref as SVGSVGElement);
  //   onCleanup(() => {
  //     obs.disconnect()
  //   })
  // })

  let pin: SVGSVGElement

  function updatePinPosition(): undefined {
    if (pin) {
      const box = pin.getBoundingClientRect();
      setPinPosition({
        left: box.left,
        top: box.top,
      });
    }
  }

  onMount(() => {
    updatePinPosition()
  })

  createRenderEffect(() => {
    if (props.updatePinPosition) {
      props.updatePinPosition(updatePinPosition);
    }
  })

  // function useSocket(apply: (arg0: OperatorSocket) => void) {
  //   if (node_id === undefined) return;
  //   useSocketsData(sd => {
  //     const [sockets] = sd;
  //     const self = sockets[props.name];
  //     if (self === undefined) return;
  //     apply({
  //       data: self,
  //       ref: {
  //         node_id, name: props.name,
  //       }
  //     });
  //   })
  // }

  const onTouchPress = (e: PointerEvent) => {
    if (node_id === undefined) return;
    const socketRef: SocketRef = { node_id, name: props.name };
    e.stopPropagation()
    useOperatorsData(operators => {
      useSocketsData(([sockets]) => {
        const data = sockets[props.name];
        if (data === undefined) return;
        operators.setDragSocket({
          ref: socketRef,
          data,
        })
      })
    })
  }

  return (
    <div
      data-kind={NodeSocketKind}
      ref={ref => {
        props.refs?.body?.(ref)
        body = ref;
      }}
      onPointerDown={onTouchPress}
      class={classNames()}>
      <svg
        ref={ref => {
          props.refs?.pin?.(ref);
          pin = ref;
        }}
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
