import { ParentProps, children as c } from 'solid-js';

export function children(
  props: ParentProps,
) {
  return c(() => props.children)
}

export type FunctionSetter<T extends Function> = (value: (prev: T) => T) => T
