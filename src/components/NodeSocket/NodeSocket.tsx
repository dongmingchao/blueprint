import {
  ParentProps
} from 'solid-js';
import css from './NodeSocket.module.styl';

export interface Props extends ParentProps {
  onTouchPress?(e: PointerEvent): void;
  class?: string;
  name: keyof any;
  refs?: {
    body?(el: HTMLDivElement): void
    pin?(el: SVGSVGElement): void
  }
}

function NodeSocket(props: Props) {
  function classNames() {
    let c = [css.socket];
    if (props.class) c.push(props.class);
    return c.join(' ');
  }

  console.info('[Render]::NodeSocket Render');

  return (
    <div
      ref={ref => {
        props.refs?.body?.(ref)
      }}
      onPointerDown={props.onTouchPress}
      class={classNames()}>
      <svg
        ref={ref => {
          props.refs?.pin?.(ref)
        }}
        class={css.pin}
        width="15" height="15">
        <circle
          cx="7"
          cy="7"
          r="6"
          stroke="white"
          stroke-width="2"
          fill="#acd"
        />
      </svg>
      {props.children}
    </div>
  );
}

export default NodeSocket;
