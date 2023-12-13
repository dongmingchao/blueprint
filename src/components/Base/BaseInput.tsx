import { JSX, Setter, Signal } from 'solid-js';
import css from './BaseInput.module.styl';

export interface TextProps {
  value: Signal<string>
  type: 'text'
}

export interface NumberProps {
  value: Signal<number>
  type: 'number'
}

type Props = (TextProps | NumberProps) & {
  class?: string
}

function BaseInput(props: Props) {
  const [value, pValue] = props.value;
  const updateValue: JSX.EventHandler<HTMLInputElement, InputEvent> = e => {
    switch (props.type) {
      case 'number':
        const p = parseFloat(e.currentTarget.value);
        if (isNaN(p)) return;
        (pValue as Setter<number>)(p);
        break;
      case 'text':
        (pValue as Setter<string>)(e.currentTarget.value);
        break;
    }
  }

  function whenFocus(e: PointerEvent) {
    e.stopPropagation()
  }

  function classNames() {
    const ret: string[] = []
    if (css['base-input']) ret.push(css['base-input'])
    if (props.class) ret.push(props.class)
    return ret.join(' ')
  }

  return <input
    placeholder='None'
    class={classNames()}
    type={props.type}
    value={value()}
    onPointerDown={whenFocus}
    onInput={updateValue} />
}

export default BaseInput;
