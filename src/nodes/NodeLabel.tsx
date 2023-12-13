import Node from '@/components/Node/Node';
import { observeSize } from '@/utils/observeSize';
import { JSX, createSignal } from 'solid-js';
import InputNodeSocketElement from '@/sockets/InputNodeSocketElement';

function NodeLabelDraw() {
  const input_value = createSignal<JSX.Element>();
  const [value] = input_value;

  console.info('[Render]::NodeLabelDraw Render')
  function onContentResize(_rect: DOMRectReadOnly) {
  }

  return (
    <Node>
      Element
      <hr />
      <div ref={observeSize(onContentResize)}>{value()}</div>
      <InputNodeSocketElement
        name="value"
        value={input_value} />
    </Node>
  );
}

export default NodeLabelDraw;
