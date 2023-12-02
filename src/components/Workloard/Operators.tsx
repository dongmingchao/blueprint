import { OperatorSocket } from '@/core/operators';
import { Location2D } from '@/interfaces/node';
import { FunctionSetter } from '@/utils/children';
import { whenNotUndefined } from '@/utils/props';
import { Point, Segment } from '@flatten-js/core';
import { Accessor, Show, createEffect, createMemo, createSignal, splitProps, useContext } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import BaseLink from '../NodeLink/BaseLink';
import BasePath from '../Shapes/BasePath';
import css from './Operators.module.styl';
import { OperatorsData } from './OperatorsProvider';

export interface Props {
  onAddLink?(focus: OperatorSocket, hover: OperatorSocket): void;
  onRemoveLink?(id: symbol): void;
  cursor: Accessor<Location2D>
  onTouchRelease: FunctionSetter<(e: PointerEvent) => void>
  onTouchPress: FunctionSetter<(e: PointerEvent) => void>
}

function Operators(props: Props) {
  const useOperatorsData = whenNotUndefined(useContext(OperatorsData))
  const [focusSocket, setFocusSocket] = createSignal<OperatorSocket>()
  const [end, setEnd] = createSignal(props.cursor);

  useOperatorsData(data => {

    createEffect(() => {
      const [, upd] = data.op;
      upd('isDrawing', isDraw())
    })

    createEffect(() => {
      const [od] = data.op;
      setFocusSocket(od.dragSocket);
      if (od.dragSocket === undefined) {
        props.onTouchRelease(prev => () => {
          setIsDraw(false);
        })
      }
    })

    function resetFocus() {
      const [, upd] = data.op;
      upd({ dragSocket: undefined });
    }

    createEffect(() => {
      const focus = focusSocket();
      if (focus === undefined) return;
      const [od, upd] = data.op;
      const hover = od.hoverSocket;
      if (hover === undefined) {
        setEnd(() => props.cursor)
        props.onTouchRelease(prev => resetFocus)
      } else if (hover.data !== focus.data) {
        setEnd(() => createMemo(() => {
          const p = hover.data.pinPosition();
          if (p === undefined) return props.cursor();
          return { left: p.left + 7, top: p.top + 7 };
        }));
        const [{ onAddLink }] = splitProps(props, ['onAddLink'])
        if (onAddLink) {
          props.onTouchRelease(prev => e => {
            onAddLink(focus, hover);
            upd({ dragSocket: undefined });
          })
        }
      }
    })

  })

  const socketLocation = createMemo<Location2D>(() => {
    let socket = focusSocket()?.data.pinPosition();
    socket = socket ?? { left: 0, top: 0 };
    return {
      left: socket.left + 7,
      top: socket.top + 7,
    }
  });

  const operatorTargetLocation = () => end()()

  const [isDraw, setIsDraw] = createSignal(false);
  const [points, setPoints] = createStore<Location2D[]>([]);

  createEffect(() => {
    props.onTouchPress(prev => e => {
      e.preventDefault();
      setIsDraw(true);
    })
  })

  createEffect(() => {
    if (isDraw()) {
      // console.log('point add', points.length, props.cursor())
      setPoints(produce(p => p.push(props.cursor())))
    } else {
      setPoints(p => {
        const [{ onRemoveLink }] = splitProps(props, ['onRemoveLink']);
        if (p.length && onRemoveLink) {
          useOperatorsData(data => {
            const path: Segment[] = []
            p.map(e => new Point(e.left, e.top)).reduce((pv, ev) => {
              path.push(new Segment(pv, ev))
              return ev;
            })
            const { geometry: { links } } = data;
            for (const id of Object.getOwnPropertySymbols(links)) {
              const item = links[id];
              const seg = item();
              const select = path.filter(d => d.intersect(seg).length).length;
              if (select) {
                onRemoveLink(id);
              }
            }
          })
        }
        return []
      });
    }
  })

  let drawline: SVGPathElement | undefined;

  createEffect(() => {
    if (drawline === undefined) return;

  })

  return (
    <div class={css.operators}>
      <svg class={css.painter}>
        <Show when={focusSocket() !== undefined}>
          <circle
            cx={operatorTargetLocation().left}
            cy={operatorTargetLocation().top}
            r="4"
            fill="red"
          />
          <BaseLink
            noPainter
            end={operatorTargetLocation}
            start={socketLocation} />
        </Show>
        <BasePath ref={drawline} LineTo={points} />
      </svg>
    </div>
  )
}

export default Operators;
