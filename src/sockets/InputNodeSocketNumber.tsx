import BaseInput from '@/components/Base/BaseInput';
import InputNodeSocket from '@/components/NodeSocket/InputNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { createInputSocket, injectIsLinked } from '@/utils/sockets';
import {
  Accessor, JSX,
  Show,
  Signal, createSignal
} from 'solid-js';
import { numberSocketOnLink } from './NumberSocket';
import css from '@/components/NodeSocket/NodeSocket.module.styl'
import { classNames } from '@/utils/props';

interface NodeSocketNumberProps extends NodeSocketProps {
  defaultValue?: number;
  label?: JSX.Element;
  isLinked: Accessor<boolean>;
  value?: Signal<number>;
  classes?: {
    label?: string
  }
  styles?: {
    label?: string
  }
}

function InputNodeSocketNumber(props: NodeSocketNumberProps) {
  const value = props.value ?? createSignal(props.defaultValue ?? 0);
  const [, setValue] = value;
  createInputSocket(props.name, setValue, numberSocketOnLink)

  return (
    <InputNodeSocket name={props.name}>
      <label
        style={classNames(props.styles?.label)}
        class={classNames(css.label, props.classes?.label)}>
        {props.label ?? props.name.toString()}
      </label>
      <Show when={!props.isLinked()} fallback={value[0]()}>
        <BaseInput type='number' value={value} />
      </Show>
    </InputNodeSocket>
  );
}

export default injectIsLinked(InputNodeSocketNumber, 'inputs');
