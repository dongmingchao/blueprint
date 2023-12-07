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

function BaseInput(props: TextProps | NumberProps) {
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

  return <input
    placeholder='None'
    class={css['base-input']}
    type={props.type}
    value={value()}
    onPointerDown={whenFocus}
    onInput={updateValue} />
}

export default BaseInput;
