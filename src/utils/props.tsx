import { Component, ComponentProps, ValidComponent, mergeProps } from 'solid-js';
import { SetStoreFunction } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';

export function withDefaultProps<T extends ValidComponent>(
  value: ComponentProps<T>, Com: T
) {
  return function (props: ComponentProps<T>) {
    const merged = mergeProps(value, props);
    return <Dynamic component={Com} {...merged} />
  }
}

export type StoreReturn<T> = [get: T, set: SetStoreFunction<T>]

export function createF<T extends Component>(Com: T, parent?: any) {
  function ret(props: ComponentProps<T>) {
    const c = () => <Com {...props} />;
    const aa = parent;
    console.log('parent', aa)
    c.prototype = aa
    // c.prototype.testprops.push('00000000000000000000000000')
    return c;
  }
  return ret;
}

export function whenNotUndefined<T>(target: T | undefined) {
  return function <R>(apply: (arg0: T) => R) {
    if (target === undefined) return;
    return apply(target);
  }
}
