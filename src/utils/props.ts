import { Component, ComponentProps, mergeProps } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import { isDefined } from './CommonTools';

export function withDefaultProps<T extends Component>(
  value: ComponentProps<T>, Com: T
) {
  return function (props: ComponentProps<T>) {
    const merged = mergeProps(value, props);
    return Com(merged)
  }
}

export type StoreReturn<T> = [get: T, set: SetStoreFunction<T>]

export function whenNotUndefined<T>(target: T | undefined) {
  return function <R>(apply: (arg0: T) => R) {
    if (target === undefined) return;
    return apply(target);
  }
}

export function classNames(...names: Array<string | undefined | Array<string | undefined>>) {
  return names.flat().filter(isDefined).join(' ')
}
