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
    if (isPairMark(sibiling)) {
      previous.push(sibiling.cloneNode(true));
    }
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
    if (isPairMark(sibiling)) {
      next.unshift(sibiling.cloneNode(true));
    }
    sibiling = sibiling.nextSibling;
  }
  right.replaceChildren(...next);
  return right;
}

function isMark(node: Node): node is Node & { dataset: { isMark: string } } {
  if ('dataset' in node) {
    const data: any = node.dataset;
    if ('isMark' in data) return typeof data.isMark === 'string';
  }
  return false;
}

function isPairMark(node: Node): boolean {
  if (isMark(node)) {
    return node.dataset.isMark === 'pair';
  }
  return false;
}

export function createBoldMark() {
  const markend = document.createElement('label');
  markend.innerText = '**';
  markend.dataset.isMark = 'pair';
  return markend;
}

export function isEmptyNode(node: Node | null): boolean {
  if (node === null) return true
  if (node.firstChild) return false
  if (node instanceof Text) return node.length === 0
  return false
}
