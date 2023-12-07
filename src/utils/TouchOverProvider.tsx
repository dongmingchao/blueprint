import { Accessor, ParentProps, batch, createContext, createSignal, useContext } from 'solid-js';
import { whenNotUndefined } from './props';

const TouchOver = createContext<TouchData>()

interface TouchData {
  el: Accessor<Element | null>
  event: Accessor<PointerEvent | undefined>
}

function TouchOverProvider(props: ParentProps) {
  const [el, setCapturedEl] = createSignal<Element | null>(null, {
    // equals(prev, next) {
    //   console.log('el equals', prev === next); //true
    //   return prev === next;
    // },
  });
  const [event, setCapturedEvent] = createSignal<PointerEvent | undefined>(undefined, {
    // equals(prev, next) {
    //   console.log('event equals', prev === next); //false
    //   return prev === next;
    // },
  });

  function onTouchMove(e: PointerEvent) {
    const el = document.elementFromPoint(e.pageX - window.scrollX, e.pageY - window.scrollY);
    batch(() => {
      setCapturedEl(el)
      setCapturedEvent(e)
    })
  }

  return <TouchOver.Provider value={{ el, event }}>
    <div onPointerMove={onTouchMove}>
      {props.children}
    </div>
  </TouchOver.Provider>
}

export function useTouchOverElement() {
  return whenNotUndefined(useContext(TouchOver))
}

export default TouchOverProvider;
