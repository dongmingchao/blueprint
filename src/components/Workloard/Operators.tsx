import { OperatorSocket } from '@/core/operators';
import { Location2D } from '@/interfaces/node';
import { useTouchOverElement } from '@/utils/TouchOverProvider';
import { FunctionSetter } from '@/utils/children';
import { Point, Segment } from '@flatten-js/core';
import { Accessor, Show, createEffect, createMemo, createSignal, splitProps, untrack } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import BaseLink from '../NodeLink/BaseLink';
import BasePath from '../Shapes/BasePath';
import { useOperatorsData } from '../providers/OperatorsProvider';
import css from './Operators.module.styl';

export interface Props {
  onAddLink?(focus: OperatorSocket, hover: OperatorSocket): void;
  onRemoveLink?(id: symbol): void;
  cursor: Accessor<Location2D>
  onTouchRelease: FunctionSetter<(e: PointerEvent) => void>
  onTouchPress: FunctionSetter<(e: PointerEvent) => void>
}

function Operators(props: Props) {
  const withOperatorsData = useOperatorsData();
  const [end, setEnd] = createSignal(props.cursor);
  const usePointer = useTouchOverElement();

  createEffect(() => {
    usePointer(({ el }) => {
      const cur = el();
      if (cur === null) return;
      withOperatorsData(data => {
        const { elRef, op } = data;
        const focus = op.dragSocket();
        if (focus === undefined) return;
        const hover = untrack(op.hoverSocket)
        if (hover !== undefined && hover.data.el.contains(cur)) return;
        for (const [id, item] of elRef.inputs) {
          if (id.contains(cur)) {
            data.setHoverSocket(item);
            return;
          }
        }
        data.setHoverSocket();
      })
    })
  })

  withOperatorsData(data => {

    createEffect(() => {
      data.op.isDrawing = isDraw;
    })

    createEffect(() => {
      const od = data.op;
      const focus = od.dragSocket();
      const hover = od.hoverSocket();
      if (hover === undefined || focus === undefined) {
        setEnd(() => props.cursor)
        // props.onTouchRelease(prev => resetFocus)
      } else if (hover.data !== focus.data) {
        setEnd(() => createMemo(() => {
          const p = hover.data.pinPosition();
          if (p === undefined) return props.cursor();
          return { left: p.left + 7, top: p.top + 7 };
        }));
        // const [{ onAddLink }] = splitProps(props, ['onAddLink'])
        // if (onAddLink) {
        //   props.onTouchRelease(prev => e => {
        //     onAddLink(focus, hover);
        //     resetFocus()
        //   })
        // }
      }
    })

  })
  const isDraggingSocket = createMemo<boolean>(() => {
    return withOperatorsData(data => {
      const od = data.op;
      return od.dragSocket();
    }) !== undefined;
  })

  const socketLocation = createMemo<Location2D>(() => {
    return withOperatorsData<Location2D | undefined>(data => {
      const od = data.op;
      const socket = od.dragSocket()?.data.pinPosition()
      if (socket) return {
        left: socket.left + 7,
        top: socket.top + 7,
      }
    }) ?? { left: 0, top: 0 }
  });

  const operatorTargetLocation = () => end()()

  const [isDraw, setIsDraw] = createSignal(false);
  const [points, setPoints] = createStore<Location2D[]>([]);

  function startDraw() {
    setIsDraw(true)
  }

  function stopDraw() {
    setIsDraw(false)
  }

  function onTouchRelease() {
    stopDraw()
    withOperatorsData(data => {
      const od = data.op;
      const focus = od.dragSocket();
      const hover = od.hoverSocket();
      data.setDragSocket();
      data.setHoverSocket();
      if (focus === undefined || hover === undefined) {
        return;
      }
      if (focus.data === hover.data) return;
      if (props.onAddLink === undefined) return;
      props.onAddLink(focus, hover);
    })
  }

  createEffect(() => {
    props.onTouchPress(_prev => startDraw)
  })

  createEffect(() => {
    props.onTouchRelease(_prev => onTouchRelease)
  })

  createEffect(() => {
    if (isDraw()) {
      setPoints(produce(p => p.push(props.cursor())))
    } else {
      setPoints(p => {
        const [{ onRemoveLink }] = splitProps(props, ['onRemoveLink']);
        if (p.length && onRemoveLink) {
          withOperatorsData(data => {
            const path: Segment[] = []
            p.map(e => new Point(e.left, e.top)).reduce((pv, ev) => {
              path.push(new Segment(pv, ev))
              return ev;
            })
            const { geometry: { links } } = data;
            for (const id of Object.getOwnPropertySymbols(links)) {
              const item = links[id] as Accessor<Segment>;
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

  return (
    <div class={css.operators}>
      <svg class={css.painter}>
        <Show when={isDraggingSocket()}>
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
        <BasePath LineTo={points} />
      </svg>
    </div>
  )
}

export default Operators;
