import OutputNodeSocket, { Props as OutputNodeSocketProps } from '@/components/NodeSocket/OutputNodeSocket';
import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { NodeIndex } from '@/components/Workloard/IndexData';
import { OutputsPost } from '@/core/OutputProvider';
import { createEffect, useContext } from 'solid-js';

interface Props<NodeKind extends OutputSocketType> extends OutputNodeSocketProps {
  kind: NodeKind
}

function OutputNamedSocket<NodeKind extends OutputSocketType>(props: Props<NodeKind>) {
  const node_id = useContext(NodeIndex);
  const outputs = useContext(OutputsPost);

  createEffect(() => {
    if (outputs === undefined) return;
    if (node_id === undefined) return;
    const [, upd] = outputs;
    upd({ [node_id]: { [props.name]: props.kind } })
  })

  return <OutputNodeSocket {...props}>
    {props.children}
  </OutputNodeSocket>
}

export default OutputNamedSocket;
