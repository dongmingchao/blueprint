import InputNodeSocket from '@/components/NodeSocket/InputNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { injectIsLinked } from '@/utils/sockets';
import { JSX, Show, Signal, createSignal, Accessor } from 'solid-js';

interface NodeSocketStringProps extends NodeSocketProps {
  isLinked: Accessor<boolean>;
  defaultValue?: string;
  value?: Signal<string>;
}
function InputNodeSocketString(props: NodeSocketStringProps) {
  const [value, pValue] = props.value ?? createSignal(props.defaultValue ?? '');

  const updateValue: JSX.EventHandler<HTMLInputElement, InputEvent> = e => {
    pValue(e.currentTarget.value);
  };

  console.log('input node socket string Render');

  return (
    <InputNodeSocket {...props}>
      <Show when={!props.isLinked()}>
        <input type="text" value={value()} oninput={updateValue} />
      </Show>
    </InputNodeSocket>
  );
}

export default injectIsLinked(InputNodeSocketString, 'input')
