import NodeSocket from './NodeSocket';
import { useValuesData } from './SocketsData';
import { SocketsData } from './SocketsData';
import { whenNotUndefined } from '@/utils/props';
import { useContext, createEffect, splitProps } from 'solid-js';
import { NodeIndex } from '../Workloard/IndexData';
import { OperatorsData } from '../Workloard/OperatorsProvider';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';

export type SocketsChannel = 'inputs' | 'outputs';

interface Props {
  socketProps: NodeSocketProps
  channel: SocketsChannel
}

function ChannelNodeSocket(props: Props) {
  const values = useValuesData()?.[props.channel];
  const node_id = useContext(NodeIndex);
  const useOperatorsData = whenNotUndefined(useContext(OperatorsData));
  let socket: undefined | HTMLDivElement;
  // const socketProps = mergeProps<[NodeSocketProps, Partial<NodeSocketProps>]>(props.socketProps, {
  // })

  createEffect(() => {
    const name = props.socketProps.name;
    useOperatorsData(data => {
      if (node_id === undefined) return;
      if (socket === undefined) return;
      if (values === undefined) return;
      const value = values[0][name];
      if (value === undefined) return;
      const { elRef } = data;
      const dict = elRef[props.channel];
      dict.set(socket, {
        ref: { node_id, name },
        data: value,
      })
    });
  });

  const [{ children, refs }, socketProps] = splitProps(props.socketProps, ['children', 'refs'])

  return (
    <SocketsData.Provider value={values}>
      <NodeSocket
        {...socketProps}
        refs={{
          ...refs,
          body(el) {
            socket = el;
            refs?.body?.(el);
          },
        }}>
        {children}
      </NodeSocket>
    </SocketsData.Provider>
  );
}

export default ChannelNodeSocket;
