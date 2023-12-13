import InputNodeSocket from '@/components/NodeSocket/InputNodeSocket';
import { Props as NodeSocketProps } from '@/components/NodeSocket/NodeSocket';
import { injectIsLinked } from '@/utils/sockets';
import { Accessor, For, JSX, Signal } from 'solid-js';

interface Props<K extends string> extends NodeSocketProps {
  isLinked: Accessor<boolean>;
  label?: JSX.Element;
  value: Signal<K>;
  options: Record<K, JSX.Element>
}

function InputNodeSocketSelector<T extends string>(props: Props<T>) {
  const [value, setValue] = props.value

  const onSelect: JSX.ChangeEventHandlerUnion<HTMLSelectElement, Event> = function (e) {
    setValue(() => e.currentTarget.value as T)
  }

  return <InputNodeSocket {...props}>
    <label>
      {props.label ?? props.name.toString()}
    </label>
    <select value={value()} onChange={onSelect}>
      <For each={Object.entries<JSX.Element>(props.options)}>
        {(item) => <option value={item[0]}>
          {item[1]}
        </option>}
      </For>
    </select>
  </InputNodeSocket>
}

export default injectIsLinked(InputNodeSocketSelector, 'inputs')
