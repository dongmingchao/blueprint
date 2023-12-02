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
  const [value, pValue] = props.value ?? createSignal(props.defaultValue ?? 0);
  const updateValue: JSX.EventHandler<HTMLInputElement, InputEvent> = function (
    e
  ) {
    const p = parseFloat(e.currentTarget.value);
    if (isNaN(p)) return;
    pValue(p);
  };

  return (
    <InputNodeSocket name={props.name}>
      <label style="width: 1em">
        {props.label ?? props.name.toString()}
      </label>
      <Show when={!props.isLinked()} fallback={value()}>
        <input
          style="max-width: 8em"
          type="number"
          onInput={updateValue}
          value={value()} />
      </Show>
    </InputNodeSocket>
  );
}

export default injectIsLinked(InputNodeSocketNumber, 'input');
