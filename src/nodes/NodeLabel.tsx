import Node from '@/components/Node/Node';
import { NodeType } from '@/components/Workloard/NodesData';
import { stringSocketOnLink } from '@/sockets/StringSocket';
import { createInputSocket } from '@/utils/sockets';
import InputNodeSocketString from './InputNodeSocketString';

class NodeLabel extends NodeType {

  children() {
    return NodeLabelDraw;
  }
}

export function NodeLabelDraw() {
  const input_value = createInputSocket('value', stringSocketOnLink, '');
  const [value] = input_value.value;

  console.info('[Render]::NodeLabelDraw Render')
  let body: HTMLDivElement | undefined;

  return (
    <Node ref={body}>
      Label
      <hr />
      <label>{value()}</label>
      <InputNodeSocketString name="value" value={input_value.value} />
    </Node>
  );
}

export default NodeLabel;
