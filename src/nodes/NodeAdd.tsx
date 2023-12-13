import Node from '@/components/Node/Node';
import { NumberOutput } from '@/sockets/NumberSocket';
import OutputNamedSocket from '@/sockets/OutputNamedSocket';
import { createEffect, createSignal } from 'solid-js';
import InputNodeSocketNumber from '../sockets/InputNodeSocketNumber';

function NodeAddDraw() {
  const output_result = new NumberOutput();
  const input_a = createSignal(0)
  const input_b = createSignal(0)

  createEffect(() => {
    const [, setResult] = output_result.value;
    const [a] = input_a;
    const [b] = input_b;
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
        styles={{ label: 'width: 1em;' }}
        name="A"
        value={input_a} />
      <InputNodeSocketNumber
        styles={{ label: 'width: 1em;' }}
        name="B"
        value={input_b} />
    </Node>
  );
}

export default NodeAddDraw;
