import InputNodeSocket from '@/components/NodeSocket/InputNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { findSocketType } from '@/core/process';
import { OnLink, createInputSocket, injectIsLinked } from '@/utils/sockets';
import { Accessor, JSX, Signal, createSignal } from 'solid-js';
import { ElementOutput } from './ElementSocket';
import css from '@/components/NodeSocket/NodeSocket.module.styl'

interface Props extends NodeSocketProps {
  isLinked: Accessor<boolean>;
  defaultValue?: JSX.Element;
  label?: JSX.Element;
  value?: Signal<JSX.Element>;
}

const elementSocketOnLink: OnLink<JSX.Element> = function (
  updater, ref
) {
  const kind = findSocketType(ref)
  if (kind === undefined) return;
  if (
    kind instanceof ElementOutput
  ) {
    updater(() => _prev => kind.process());
  } else {
    updater(() => _ => String(kind.process()))
  }
}

function InputNodeSocketElement(props: Props) {
  const value = props.value ?? createSignal(props.defaultValue);
  createInputSocket(props.name, value[1], elementSocketOnLink)

  return <InputNodeSocket {...props}>
    <label class={css.label}>
      {props.label ?? props.name.toString()}
    </label>
  </InputNodeSocket>
}

export default injectIsLinked(InputNodeSocketElement, 'inputs')
