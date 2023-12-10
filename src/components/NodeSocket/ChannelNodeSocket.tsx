import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { SocketsChannel } from '@/interfaces/socket';
import { createSignal, splitProps } from 'solid-js';
import { dispatchRegisterSocket } from '../providers/NodesProvider';
import { dispatchSetDragSocket } from '../providers/OperatorsProvider';
import NodeSocket from './NodeSocket';

interface Props {
  socketProps: NodeSocketProps
  channel: SocketsChannel
}

function ChannelNodeSocket(props: Props) {
  let socket: undefined | HTMLDivElement;
  // const [socket, setSocket] = createSignal<HTMLDivElement>()
  const [painter, setPainter] = createSignal<SVGSVGElement>()
  const setDragSocket = dispatchSetDragSocket();
  dispatchRegisterSocket(
    () => socket, painter,
    props.socketProps.name, props.channel)

  const [{ children, refs }, socketProps] = splitProps(props.socketProps, ['children', 'refs'])

  function onTouchPress(e: PointerEvent) {
    e.stopPropagation()
    setDragSocket(props.socketProps.name, props.channel);
  }

  return (
    <NodeSocket
      onTouchPress={onTouchPress}
      {...socketProps}
      refs={{
        ...refs,
        body(el) {
          socket = el;
          refs?.body?.(el);
        },
        pin(el) {
          setPainter(el)
          refs?.pin?.(el)
        },
      }}>
      {children}
    </NodeSocket>
  );
}

export default ChannelNodeSocket;
