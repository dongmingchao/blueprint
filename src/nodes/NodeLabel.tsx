import Node from '@/components/Node/Node';
import { stringSocketOnLink } from '@/sockets/StringSocket';
import { createInputSocket } from '@/utils/sockets';
import InputNodeSocketString from '../sockets/InputNodeSocketString';
import { observeSize } from '@/utils/observeSize';

function NodeLabelDraw() {
  const input_value = createInputSocket('value', stringSocketOnLink, '');
  const [value] = input_value.value;

  console.info('[Render]::NodeLabelDraw Render')
  let body: HTMLDivElement | undefined;
  let updatePin = () => undefined;

  function onContentResize(_rect: DOMRectReadOnly) {
    updatePin()
  }

  return (
    <Node ref={body}>
      Label
      <hr />
      <div ref={observeSize(onContentResize)}>{value()}</div>
      <InputNodeSocketString
        name="value"
        updatePinPosition={f => updatePin = f}
        value={input_value.value} />
    </Node>
  );
}

export default NodeLabelDraw;
