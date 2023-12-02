import { Location2D } from '@/interfaces/node';
import { createMemo, createEffect, Ref } from 'solid-js';

export interface Props {
  LineTo: Location2D[]
  ref?: Ref<SVGPathElement>
}

function BasePath(props: Props) {

  const d = createMemo((): string | undefined => {
    const [head, ...rest] = props.LineTo;
    if (head === undefined) return;
    let final = `M ${head.left} ${head.top}`;
    return rest.reduce((pv, cv) => `${pv} L ${cv.left} ${cv.top}`, final);
  })

  // createEffect(() => {
  //   console.warn('d = ', d());
  // })

  return <path ref={props.ref} stroke-width="2" stroke="red" fill="none" d={d()} />
}

export default BasePath;
