import {
  Accessor,
  Context,
  For,
  JSXElement,
  ParentProps,
} from 'solid-js';

export interface ArrayEntry<T = unknown> {
  item: T;
  index: Accessor<number>;
}

export interface ForIndexProps<T> extends ParentProps {
  each: T[];
  indexContext: Context<ArrayEntry<T> | undefined>;
}

export interface ForExtendProps<T> {
  each: T[];
  children(item: T, index: Accessor<number>): JSXElement;
}

export function ForIndex<T>(props: ForIndexProps<T>) {
  return For({
    get each() {
        return props.each;
    },
    children(item: T, index: Accessor<number>): JSXElement {
      return props.indexContext.Provider({
        value: { index, item },
        get children() {
          return props.children;
        }
      })
    }
  })
}
