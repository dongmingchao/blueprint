import Node from '@/components/Node/Node';
import InputNodeSocketNumber from '../sockets/InputNodeSocketNumber';
import OutputNamedSocket from '@/sockets/OutputNamedSocket';
import { NumberOutput, numberSocketOnLink } from '@/sockets/NumberSocket';
import { createEffect } from 'solid-js';
import { createInputSocket } from '@/utils/sockets';

function NodeAddDraw() {
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

export default NodeAddDraw;
