import ChannelNodeSocket from './ChannelNodeSocket';
import { Props as NodeSocketProps } from './NodeSocket';
import css from './NodeSocket.module.styl';
import { splitProps, mergeProps } from 'solid-js';

export interface Props extends NodeSocketProps { }

function InputNodeSocket(props: Props) {
  const socketProps = mergeProps(props, {
    class: css.input,
  })

  console.info('[Render]::InputNodeSocket Render');

  return <ChannelNodeSocket socketProps={socketProps} channel='inputs' />
}

export default InputNodeSocket;
