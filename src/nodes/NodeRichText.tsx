import Node from '@/components/Node/Node'
import { Location2D } from '@/interfaces/node'
import { caretPositionFromPoint } from '@/utils/caretPosition'
import { JSX, batch, createEffect, createSignal } from 'solid-js'
import css from './NodeRichText.module.styl'
import { previousClone, nextClone, relativePath, createBoldMark, isEmptyNode } from '@/utils/DOMtools'

const strong = /(?<MarkStart>\*\*)(?<text>.*)(?<MarkEnd>\*\*)/gs
// const em = /(?<MarkStart>\*)(?<text>.*)(?<MarkEnd>\*)/gs

function NodeRichText() {
  let body: HTMLDivElement | undefined
  let buffer: HTMLSpanElement | undefined
  let lastCaret: HTMLSpanElement | undefined
  const caretRange = document.createRange()
  const [anchorOffset, setAnchorOffset] = createSignal(0)
  const [currentEditNode, setCurrentEditNode] = createSignal<Text | null>(null)
  const [caretTransform, setCaretTransform] = createSignal<Location2D>({ left: 0, top: 0 })
  const [relativeNodes, setRelativeNodes] = createSignal<Element[]>([])

  function updateRelativeNodes(value: Element[]) {
    setRelativeNodes(prev => {
      prev.concat(value).forEach(item => {
        item.classList.toggle('focus')
      })
      return value
    })
  }

  createEffect(() => {
    /**
     * 更新光标位置
     */
    if (lastCaret === undefined) return
    const node = currentEditNode()
    if (node === null) return
    setTimeout(function () {
      buffer?.focus()
    }, 0);
    const parent = node.parentElement
    if (parent === null) return
    parent.insertBefore(lastCaret, node.nextElementSibling)
    if (body === undefined) return
    updateRelativeNodes(relativePath(body, parent))
  })

  function updateCaretRange() {
    let cen = currentEditNode()
    if (cen === null) {
      setCaretTransform({ left: 0, top: 0 })
      return
    }
    if (cen instanceof Text) {
      if (cen.length === 0) {
        setCaretTransform({ left: 0, top: 0 })
        return
      }
    }
    const val = anchorOffset()
    caretRange.setEnd(cen, val)
    caretRange.collapse()
    setCaretTransform(updateCaretTransform())
  }

  function insertBeforeEditing(
    node: () => Node[] | Node | undefined,
    child: Node | null = null,
    outer: HTMLElement | null = null,
  ) {
    if (child === null) {
      child = currentEditNode()
    }
    if (child === null) return
    if (outer === null) {
      outer = child.parentElement
    }
    if (outer === null) return
    const nd = node()
    if (nd === undefined) return
    const n = Array.isArray(nd) ? nd : [nd]
    console.warn(outer, child)
    for (const dom of n) {
      outer.insertBefore(dom, child)
    }
  }

  function onInput(e: InputEvent) {
    e.preventDefault()
    const ano = anchorOffset()
    const node = currentEditNode()
    const relatives = relativeNodes()
    console.warn('input', e.inputType, e.data)

    switch (e.inputType) {
      case 'deleteContentBackward':
        if (ano > 0) {
          if (node instanceof Text) {
            node.deleteData(ano - 1, 1)
            setAnchorOffset(a => a - 1)
            updateCaretRange()
          }
        }
        break
      case 'insertCompositionText':
        break
      case 'insertText':
        if (e.data) {
          const d = e.data
          if (node === null) {
            if (body) {
              const n = document.createTextNode(d)
              body.insertBefore(n, body.firstChild)
              setCurrentEditNode(n)
              setAnchorOffset(_ => d.length)
            }
          } else if (node instanceof Text) {
            node.insertData(ano, d)
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
            // if (start !== node.data.length) {
            //   generated.push(
            //     document.createTextNode(
            //       node.data.substring(start, node.data.length)))
            // }
            if (generated.length === 0) {
              setAnchorOffset(a => a + d.length)
            } else {
              insertBeforeEditing(() => {
                node.deleteData(0, start)
                setAnchorOffset(a => a + d.length - start)
                return generated
              })
            }
          }
          updateCaretRange()
        }
        break
      case 'insertParagraph':
        if (node === null) return
        const rest = node.splitText(ano)
        // let [newParagraph, currentEditing]: [Node, Node] = [node, rest]
        let [newParagraph, currentEditing] = relatives.reduce<[Node, Node]>(
          ([l, r], cv) => {
          if (cv instanceof HTMLElement) {
            const left = isEmptyNode(l) ? l : previousClone(cv.tagName, l)
            const right = isEmptyNode(r) ? r : nextClone(cv.tagName, r)
            cv.replaceWith(left, right)
            return [left, right]
          }
          return [l, r]
        }, [node, rest])
        const parent = newParagraph.parentNode
        if (parent) {
          if (newParagraph.nodeName !== 'P') {
            newParagraph = previousClone('p', newParagraph)
            parent.insertBefore(newParagraph, currentEditing)
          }
        }
        setCurrentEditNode(rest)
        setAnchorOffset(0)
        updateCaretRange()
        break
    }
  }

  const onBodyFocus: JSX.EventHandler<HTMLElement, PointerEvent> = function (e) {
    if (buffer === undefined) return;
    buffer.tabIndex = 0
    const b = buffer
    setTimeout(function () {
      b.focus()
    }, 0);
    placeCaret(e)
  }

  const placeCaret: JSX.EventHandler<HTMLElement, PointerEvent> = function (e) {
    if (buffer === undefined) return
    const caret = caretPositionFromPoint(e.clientX, e.clientY)
    if (caret === undefined) return;
    const node = caret.textNode
    if (!(node instanceof Text)) return
    batch(() => {
      setAnchorOffset(caret.offset)
      setCurrentEditNode(node)
    })
    updateCaretRange()
  }

  function updateCaretTransform(): Location2D {
    const ret: Location2D = { left: 0, top: 0 }
    const target = lastCaret;
    if (target === undefined) return ret;
    if (buffer === undefined) return ret;
    const anchorRect = caretRange.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    // caret.insertNode(buffer)
    const offset: Location2D = {
      left: target.offsetLeft - buffer.offsetLeft + anchorRect.left - targetRect.left,
      top: target.offsetTop - buffer.offsetTop + anchorRect.top - targetRect.top,
    }
    return offset
  }

  const onComposition: JSX.EventHandlerUnion<HTMLSpanElement, CompositionEvent> = function (e) {
    e.preventDefault()
    e.target.replaceChildren()
  }

  function style(): JSX.CSSProperties {
    const caret = caretTransform()
    return {
      transform: `translate(${caret.left}px,${caret.top}px)`
    }
  }

  console.info('[Render]::NodeRichText Render')

  return <Node style={{ width: 'auto', "min-width": '10em' }}>
    Rich Text
    <hr />
    <div
      ref={body}
      class={css.board}
      onPointerDown={onBodyFocus}>

      <span ref={lastCaret} data-caret>
        <span
          style={style()}
          class={css.caret}
          ref={buffer}
          onCompositionEnd={onComposition}
          onBeforeInput={onInput} contentEditable></span>
      </span>
    </div>
  </Node>
}

export default NodeRichText
