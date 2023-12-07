import { onCleanup } from 'solid-js';

export function observePosition(
  element: HTMLElement,
  callback: (target: IntersectionObserverEntry) => void,
): () => void {
  const positionObserver = document.createElement('div');
  Object.assign(positionObserver.style, {
    position: 'fixed',
    pointerEvents: 'none',
    width: '2px',
    height: '2px',
  });
  element.appendChild(positionObserver);

  const reposition = () => {
    const rect = positionObserver.getBoundingClientRect();
    Object.assign(positionObserver.style, {
      marginLeft: `${
        parseFloat(positionObserver.style.marginLeft || '0') - rect.left - 1
      }px`,
      marginTop: `${
        parseFloat(positionObserver.style.marginTop || '0') - rect.top - 1
      }px`,
    });
  };
  reposition();

  const intersectionObserver = new IntersectionObserver(
    entries => {
      const first = entries[0];
      if (first === undefined) return;
      const visiblePixels = Math.round(first.intersectionRatio * 4);
      if (visiblePixels !== 1) {
        reposition();
        callback(first);
      }
    },
    {
      threshold: [0.125, 0.375, 0.625, 0.875],
    },
  );
  intersectionObserver.observe(positionObserver);

  return () => {
    intersectionObserver.disconnect();
    positionObserver.remove();
  };
}
function PositionObserver(el: HTMLElement) {
  const observer = document.createElement('div');
  el.appendChild(observer);
  const obs = new IntersectionObserver(
    entires => {
      console.log(entires);
    },
    {
      root: el,
    },
  );
  obs.observe(observer);

  onCleanup(() => {
    obs.disconnect();
  });
}
