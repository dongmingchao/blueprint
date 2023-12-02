import { Location2D } from '@/interfaces/node';
import { Accessor, JSX, Show } from 'solid-js';
import css from './NodeLink.module.styl';

export interface Props {
  start: Accessor<Location2D>;
  end: Accessor<Location2D>;
  noPainter?: boolean;
  /**
   * on pointer over event NOTE: 速度过快会不触发
   * @param e Event
   */
  onTouchOver?(e: PointerEvent):void;
}

function BaseLink(props: Props) {
  let paint: SVGSVGElement | undefined;

  // createEffect(
  //   on(
  //     [props.start, props.end],
  //     () => {
  //       if (paint) {
  //         const box = paint.getBBox();
  //         paint.setAttribute('width', box.width.toString());
  //         paint.setAttribute('height', box.height.toString());
  //         // TODO: SVG画布匹配内容
  //         // paint.style.transform = `translate(${box.x}px, ${box.y}px)`
  //         // paint.setAttribute(
  //         //   'viewBox',
  //         //   `${box.x} ${box.y}`,
  //         // );
  //       }
  //     },
  //     { defer: true },
  //   ),
  // );

  const style = function (): JSX.CSSProperties {
    const sp = props.start();
    return {
      left: sp.left + 'px',
      top: sp.top + 'px',
    };
  };

  return (
    <Show when={props.noPainter} fallback={
      <svg style={style()} ref={paint} class={css.line}>
        <line
          onPointerOver={props.onTouchOver}
          x2={props.end().left}
          y2={props.end().top}
          style="stroke: rgb(39 160 122);stroke-width: 2;stroke-opacity: .5;stroke-linecap: round;
    stroke-dasharray: 6;"
        />
      </svg>
    }>
      <line
        onPointerOver={props.onTouchOver}
        x1={props.start().left}
        y1={props.start().top}
        x2={props.end().left}
        y2={props.end().top}
        style="stroke: rgb(39 160 122);stroke-width: 2;stroke-opacity: .5;stroke-linecap: round;
    stroke-dasharray: 6;"
      />
    </Show>
  );
}

export default BaseLink;
