import { strong } from './RichText/regexs';

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

export function mergeText(parent: Node) {
  let last: Node | undefined
  let node = parent.firstChild
  while(node) {
    const next = node.nextSibling
    if (node instanceof Text && last instanceof Text) {
      last.appendData(node.data);
      node.remove()
    } else {
      last = node
    }
    node = next
  }
}

export function markPairRestore(relatives: Element[]) {
  const parent = relatives[0];
  if (parent && isPairMark(parent)) {
    relatives.shift();
    const block = relatives.shift();
    if (block && block.childNodes.length > 2) {
      const start = block.childNodes.item(0) as HTMLLabelElement;
      const text = block.childNodes.item(1) as Text;
      const end = block.childNodes.item(2) as HTMLLabelElement;
      if (start.firstChild && end.firstChild) {
        block.replaceWith(
          ...start.childNodes,
          text,
          ...end.childNodes,
        );
      }
    }
  }
}

export function isEmptyNode(node: Node | null): boolean {
  if (node === null) return true;
  if (node.firstChild) return false;
  if (node instanceof Text) return node.length === 0;
  return false;
}

export function processText(node: Text) {
  const generated: Node[] = []
  let start = 0
  for (const ret of node.data.matchAll(strong)) {
    const { text } = ret?.groups ?? {}
    if (text) {
      if (ret.index !== undefined) {
        if (ret.index !== start) {
          generated.push(
            document.createTextNode(
              node.data.substring(start, ret.index)))
        }
        start = ret.index + ret[0].length
      }
      const strong = document.createElement('strong')
      strong.append(createBoldMark(), text, createBoldMark())
      generated.push(strong)
    }
  }
  if (start) {
    node.deleteData(0, start)
    node.replaceWith(...generated, node)
    // const parent = node.parentNode
    // if (parent) mergeText(parent, node)
  }
  return start
}
