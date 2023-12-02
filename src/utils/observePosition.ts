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
      const visiblePixels = Math.round(entries[0].intersectionRatio * 4);
      if (visiblePixels !== 1) {
        reposition();
        callback(entries[0]);
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
