import NodesProvider from './ParentProvider';
import Links, { Link } from './Links';
import Nodes from './Nodes';
import { createSignal, createMemo } from 'solid-js';
import { Location2D } from '@/interfaces/node';
import css from './Workloard.module.styl';
import OperatorsProvider from './OperatorsProvider';
import Operators from './Operators';
import { OperatorSocket } from '@/core/operators';
import { produce } from 'solid-js/store';
import { ReactiveMap } from '@solid-primitives/map';

function Workloard() {
  const [cursor, setCursor] = createSignal<Location2D>({ left: 0, top: 0 })
  const [cursorRelease, setCursorRelease] = createSignal<(e: PointerEvent) => void>(() => { });
  const [cursorPress, setCursorPress] = createSignal<(e: PointerEvent) => void>(() => { });
  const links = new ReactiveMap<symbol, Link>();

  function onTouchPress(e: PointerEvent) {
    cursorPress()(e)
  }

  function onTouchMove(e: PointerEvent) {
    setCursor({ left: e.clientX, top: e.clientY });
  }

  function onTouchRelease(e: PointerEvent) {
    cursorRelease()(e);
  }

  const cursorText = createMemo(() => {
    return `${cursor().left.toFixed(1)}, ${cursor().top.toFixed(1)}`
  })

  function buildNewLink(focus: OperatorSocket, hover: OperatorSocket) {
    links.set(Symbol(), {
      fromSocket: focus.ref, toSocket: hover.ref
    })
  }

  function removeLink(id: symbol) {
    links.delete(id);
  }

  console.info('[Render]::Workloard Render');

  return (
    <div
      class={css.workloard}
      onPointerDown={onTouchPress}
      onPointerUp={onTouchRelease}
      onPointerMove={onTouchMove}>
      <label>Cursor: {cursorText()}</label>
      <OperatorsProvider>
        <NodesProvider>
          <Nodes />
          <Links collection={links} />
        </NodesProvider>
        <Operators
          cursor={cursor}
          onRemoveLink={removeLink}
          onAddLink={buildNewLink}
          onTouchPress={setCursorPress}
          onTouchRelease={setCursorRelease} />
      </OperatorsProvider>
      <button type="button">Add</button>
    </div>
  );
}

export default Workloard;
