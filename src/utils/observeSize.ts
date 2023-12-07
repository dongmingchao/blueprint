import { onCleanup } from 'solid-js';

export function observeSize(onResize: (rect: DOMRectReadOnly) => void) {
  return function (el: HTMLElement) {
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        onResize(cr);
      }
    });
    obs.observe(el);
    onCleanup(() => {
      obs.disconnect();
    });
  };
}
