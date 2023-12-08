import BaseInput from '@/components/Base/BaseInput';
import InputNodeSocket from '@/components/NodeSocket/InputNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { injectIsLinked } from '@/utils/sockets';
import {
  Accessor, JSX,
  Show,
  Signal, createSignal
} from 'solid-js';

interface NodeSocketNumberProps extends NodeSocketProps {
  defaultValue?: number;
  label?: JSX.Element;
  isLinked: Accessor<boolean>;
  value?: Signal<number>;
}

function InputNodeSocketNumber(props: NodeSocketNumberProps) {
  const value = props.value ?? createSignal(props.defaultValue ?? 0);

  return (
    <InputNodeSocket name={props.name}>
      <label style="width: 1em">
        {props.label ?? props.name.toString()}
      </label>
      <Show when={!props.isLinked()} fallback={value[0]()}>
        <BaseInput type='number' value={value} />
      </Show>
    </InputNodeSocket>
  );
}

export default injectIsLinked(InputNodeSocketNumber, 'inputs');
