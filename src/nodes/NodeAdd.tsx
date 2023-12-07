import Node from '@/components/Node/Node';
import { NodeType } from '@/components/Workloard/NodesData';
import InputNodeSocketNumber from './InputNodeSocketNumber';
import OutputNamedSocket from '@/sockets/OutputNamedSocket';
import { NumberOutput, numberSocketOnLink } from '@/sockets/NumberSocket';
import { createEffect } from 'solid-js';
import { createInputSocket } from '@/utils/sockets';

class NodeAdd extends NodeType {
  children() {
    // TODO: 这里好像必须大写开头
    return NodeAddDraw;
  }

  static get marks() {
    return [this.mark, ...super.marks];
  }
}

export function NodeAddDraw() {
  const output_result = new NumberOutput();
  const [, setResult] = output_result.value;

  const input_a = createInputSocket('A', numberSocketOnLink, 0);

  const input_b = createInputSocket('B', numberSocketOnLink, 0);

  createEffect(() => {
    const [a] = input_a.value;
    const [b] = input_b.value;
    setResult(a() + b())
  })

  console.info('[Render]::NodeAddDraw Render')

  return (
    <Node>
      Add
      <hr />
      <OutputNamedSocket kind={output_result} name="result">
        Result
      </OutputNamedSocket>
      <InputNodeSocketNumber
        name="A"
        value={input_a.value} />
      <InputNodeSocketNumber
        name="B"
        value={input_b.value} />
    </Node>
  );
}

export default NodeAdd;
