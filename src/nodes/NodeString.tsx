import BaseInput from '@/components/Base/BaseInput';
import Node from '@/components/Node/Node';
import OutputNamedSocket from '@/sockets/OutputNamedSocket';
import { StringOutput } from '@/sockets/StringSocket';

function NodeString() {
  const result = new StringOutput();

return <Node>
    String
    <hr />
    <OutputNamedSocket kind={result} name="result">
      <BaseInput type='text' value={result.value} />
    </OutputNamedSocket>
  </Node>
}

export default NodeString;
