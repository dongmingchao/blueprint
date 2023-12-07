import { mergeProps } from 'solid-js';
import ChannelNodeSocket from './ChannelNodeSocket';
import { Props as NodeSocketProps } from './NodeSocket';
import css from './NodeSocket.module.styl';
export interface Props extends NodeSocketProps { }

function OutputNodeSocket(props: Props) {
  const socketProps = mergeProps(props, {
    class: css.output,
  })

  console.info('[Render]::OutputNodeSocket Render');

  return <ChannelNodeSocket socketProps={socketProps} channel='outputs' />
}

export default OutputNodeSocket;
