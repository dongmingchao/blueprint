import Node from '@/components/Node/Node'
import { Location2D } from '@/interfaces/node'
import { isEmptyNode, markPairRestore, mergeText, nextClone, previousClone, processText, relativePath } from '@/utils/DOMtools'
import { caretPositionFromPoint } from '@/utils/caretPosition'
import { JSX, batch, createEffect, createSignal } from 'solid-js'
import css from './NodeRichText.module.styl'

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

  function onInput(e: InputEvent) {
    e.preventDefault()
    const ano = anchorOffset()
    const node = currentEditNode()
    const relatives = relativeNodes()
    markPairRestore(relatives)
    console.warn('input', e.inputType, e.data)

    switch (e.inputType) {
      case 'deleteContentBackward':
        if (ano > 0) {
          if (node instanceof Text) {
            node.deleteData(ano - 1, 1)
            const start = processText(node)
            setAnchorOffset(a => a - 1 - start)
            updateCaretRange()
          }
        }
        break
      case 'insertCompositionText':
        break
      case 'insertText':
        if (e.data === null) break
        const d = e.data
        if (node === null) {
          if (body) {
            const n = document.createTextNode(d)
            body.insertBefore(n, body.firstChild)
            setCurrentEditNode(n)
            setAnchorOffset(_ => d.length)
          }
          updateCaretRange()
        } else {
          node.insertData(ano, d)
          const start = processText(node)
          setAnchorOffset(a => a + d.length - start)
          updateCaretRange()
        }
        break
      case 'insertParagraph':
        if (node === null) return
        const rest = node.splitText(ano)
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
        mergeText(newParagraph)
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

      <span ref={lastCaret} data-caret-origin></span>
      <span
        style={style()}
        class={css.caret}
        ref={buffer}
        onCompositionEnd={onComposition}
        onBeforeInput={onInput} contentEditable></span>
    </div>
  </Node>
}

export default NodeRichText
