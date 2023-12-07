import css from './Node.module.styl';
import {
  JSX,
  ParentProps,
  Ref,
  batch,
  createSignal,
} from 'solid-js';
import { NodeDataStore, useNodeData } from '../Workloard/NodesData';
import { Location2D } from '@/interfaces/node';
import { whenNotUndefined } from '@/utils/props';
import { useValuesData } from '../NodeSocket/SocketsData';

export interface Props extends ParentProps {
  ref?: Ref<HTMLDivElement>
}

function useNodeDefault<V>(defaultValue: V, apply: (node: NodeDataStore) => V) {
  return useNodeData()(apply) ?? defaultValue;
}

function Node(props: Props) {
  const [isMoving, setIsMoving] = createSignal(false);
  const [position, setTransform] = useNodeDefault(
    createSignal<Location2D>({ left: 0, top: 0 }),
    node => node.transform,
  );
  const [
    startPosition, setStartPosition
  ] = createSignal(position());
  const [
    clientStartPosition, setClientStartPosition
  ] = createSignal({
    left: 0,
    top: 0,
  });
  const useSocketData = whenNotUndefined(useValuesData());

  function style(): JSX.CSSProperties {
    const p = position();
    return {
      left: p.left + 'px',
      top: p.top + 'px',
    };
  }

  const onTouchMove = function (e: PointerEvent) {
    // e.preventDefault();
    let is_moving = isMoving();
    let start = clientStartPosition();
    let s = startPosition();
    if (is_moving) {
      let delta = {
        left: e.clientX - start.left + s.left,
        top: e.clientY - start.top + s.top,
      };
      setTransform(delta);
    }
    useSocketData(sockets => {
      Object.values(sockets.inputs[0])
        .concat(Object.values(sockets.outputs[0]))
        .forEach(so => {
          so.updatePinPosition()
        })
    })
  };

  function onTouchPress(e: PointerEvent) {
    e.stopPropagation()
    batch(() => {
      setStartPosition(position());
      setClientStartPosition({ left: e.clientX, top: e.clientY });
      setIsMoving(true);
    });
  }

  function onTouchRelease(_e: PointerEvent) {
    setIsMoving(false);
  }

  // createRenderEffect(() => {
  //   if (body === undefined) return;
  //   console.warn('ready div on resize');
  //   const [{ onResize }] = splitProps(props, ['onResize']);
  //   if (onResize === undefined) return;
  //   const obs = new ResizeObserver(entries => {
  //     for (const entry of entries) {
  //       const cr = entry.contentRect;
  //       onResize(cr);
  //     }
  //   });
  //   obs.observe(body);
  //   onCleanup(() => {
  //     obs.disconnect()
  //   })
  // })

  console.info('[Render]::Node Render');

  return (
    <div
      ref={props.ref}
      class={css.node}
      onPointerDown={onTouchPress}
      onPointerMove={onTouchMove}
      onPointerUp={onTouchRelease}
      style={style()}
    >
      {props.children}
    </div>
  );
}

export default Node;
