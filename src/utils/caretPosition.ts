export function caretPositionFromPoint(x: number, y: number) {
  let range;
  let textNode: Node;
  let offset: number;

  // @ts-ignore
  if (document.caretPositionFromPoint) {
    // @ts-ignore
    range = document.caretPositionFromPoint(x, y);
    textNode = range.offsetNode;
    offset = range.offset;
    return { textNode, offset };
  } else if (document.caretRangeFromPoint) {
    // 使用 WebKit 专有回退方法
    range = document.caretRangeFromPoint(x, y) as Range;
    textNode = range.startContainer;
    offset = range.startOffset;
    return { textNode, offset };
  }
}
