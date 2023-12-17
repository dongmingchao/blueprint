export function relativePath(context: Element, target: Element) {
  let current: Element | null = target;
  const ret: Element[] = [];
  if (!context.contains(target)) return ret;
  while (current !== null && current !== context) {
    ret.push(current);
    current = current.parentElement;
  }
  return ret;
}
export function previousClone(tagName: string, start: Node | null) {
  const left = document.createElement(tagName);
  let sibiling = start;
  const previous: Node[] = [];
  while (sibiling !== null) {
    previous.unshift(sibiling);
    sibiling = sibiling.previousSibling;
  }
  left.replaceChildren(...previous);
  return left;
}
export function nextClone(tagName: string, start: Node | null) {
  const right = document.createElement(tagName);
  let sibiling = start;
  const next: Node[] = [];
  while (sibiling !== null) {
    next.push(sibiling);
    sibiling = sibiling.nextSibling;
  }
  right.replaceChildren(...next);
  return right;
}
