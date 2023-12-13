import Node from '@/components/Node/Node';
import { ElementOutput } from '@/sockets/ElementSocket';
import InputNodeSocketElement from '@/sockets/InputNodeSocketElement';
import InputNodeSocketSelector from '@/sockets/InputNodeSocketSelector';
import OutputNamedSocket from '@/sockets/OutputNamedSocket';
import { JSX, createEffect, createSignal } from 'solid-js';

type Key = keyof typeof options

const options = {
  h1: <h1>H1</h1>,
  h2: <h2>H2</h2>,
  h3: <h3>H3</h3>,
  h4: <h4>H4</h4>,
  h5: <h5>H5</h5>,
}

function NodeHeaderDraw() {
  const result = new ElementOutput();
  const level = createSignal<Key>('h1');
  const children = createSignal<JSX.Element>()

  createEffect(() => {
    const [, setResult] = result.value;
    const [ll] = level
    const [c] = children
    switch(ll()) {
      case 'h1':
        setResult(<h1>{c()}</h1>)
        break
      case 'h2':
        setResult(<h2>{c()}</h2>)
        break
      case 'h3':
        setResult(<h3>{c()}</h3>)
        break
      case 'h4':
        setResult(<h4>{c()}</h4>)
        break
      case 'h5':
        setResult(<h5>{c()}</h5>)
        break
    }
  })

  return <Node>
    Header
    <hr />
    <OutputNamedSocket name="result" kind={result}>
      Result
    </OutputNamedSocket>
    <InputNodeSocketSelector
      options={options}
      name="level" value={level} />
    <InputNodeSocketElement name="children" value={children} />
  </Node>
}

export default NodeHeaderDraw;
