import BaseInput from '@/components/Base/BaseInput';
import InputNodeSocket from '@/components/NodeSocket/InputNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { createInputSocket, injectIsLinked } from '@/utils/sockets';
import { Accessor, Show, Signal, createSignal } from 'solid-js';
import { stringSocketOnLink } from './StringSocket';

interface NodeSocketStringProps extends NodeSocketProps {
  isLinked: Accessor<boolean>;
  defaultValue?: string;
  value?: Signal<string>;
}
function InputNodeSocketString(props: NodeSocketStringProps) {
  const value = props.value ?? createSignal(props.defaultValue ?? '');
  const [, setValue] = value;
  createInputSocket(props.name, setValue, stringSocketOnLink)

  return (
    <InputNodeSocket {...props}>
      <Show when={!props.isLinked()}>
        <BaseInput type='text' value={value} />
      </Show>
    </InputNodeSocket>
  );
}

export default injectIsLinked(InputNodeSocketString, 'inputs')
