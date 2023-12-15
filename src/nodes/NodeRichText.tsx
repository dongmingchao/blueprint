import Node from '@/components/Node/Node'
import { JSX, createSignal, onMount } from 'solid-js'
import css from './NodeRichText.module.styl'
import { caretPositionFromPoint } from '@/utils/caretPosition'

function NodeRichText() {
  let body: HTMLDivElement | undefined
  let buffer: HTMLSpanElement | undefined
  let texts: HTMLSpanElement | undefined
  const tokens: string[] = []
  const [anchorOffset, setAnchorOffset] = createSignal(0)
  const [caretTransform, setCaretTransform] = createSignal(0)

  onMount(() => {
    if (body === undefined) return;
  })

  function onInput(e: InputEvent) {
    e.preventDefault()
    const ano = anchorOffset()

    switch (e.inputType) {
      case 'deleteContentBackward':
        if (ano > 0)
          tokens.splice(ano - 1, 1)
        break
      case 'insertCompositionText':
        break
      case 'insertText':
        if (e.data && texts) {
          const d = e.data
          tokens.splice(ano, 0, d)
          const processd = tokens.reduce((pv, cv) => pv + cv, '')
          texts.innerText = processd
          setAnchorOffset(a => a + d.length)
        }
        break
    }
  }

  function onBodyFocus() {
    if (buffer === undefined) return;
    buffer.tabIndex = 0
    const b = buffer
    setTimeout(function () {
      b.focus()
    }, 0);
  }

  const placeCaret: JSX.EventHandlerUnion<HTMLSpanElement, PointerEvent> = function (e) {
    if (buffer === undefined) return
    const caret = caretPositionFromPoint(e.clientX, e.clientY)
    if (caret === undefined) return;
    const range = document.createRange()
    range.setStart(caret.textNode, caret.offset)
    const anchorRect = range.getBoundingClientRect()
    const targetRect = e.target.getBoundingClientRect()
    const anchorOffset = (e.target as HTMLSpanElement).offsetLeft + anchorRect.left - targetRect.left
    const bufferOffset = buffer.offsetLeft
    // range.insertNode(buffer)
    setCaretTransform(anchorOffset - bufferOffset)
    setAnchorOffset(caret.offset)
  }

  const onComposition: JSX.EventHandlerUnion<HTMLSpanElement, CompositionEvent> = function (e) {
    e.preventDefault()
    e.target.replaceChildren()
  }

  function style(): JSX.CSSProperties {
    return {
      transform: `translateX(${caretTransform()}px)`
    }
  }

  console.info('[Render]::NodeRichText Render')

  return <Node>
    Rich Text
    <hr />
    <div style='cursor: text;' ref={body} onPointerDown={onBodyFocus}>
      <span onPointerDown={placeCaret} ref={texts}></span>
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
