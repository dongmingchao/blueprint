import OutputNodeSocket, { Props as OutputNodeSocketProps } from '@/components/NodeSocket/OutputNodeSocket';
import { OutputSocketType } from '@/components/NodeSocket/SocketsData';
import { useNodeIndex } from '@/components/Workloard/Nodes';
import { OutputsPost } from '@/components/providers/OutputProvider';
import { createEffect, useContext } from 'solid-js';

interface Props<NodeKind extends OutputSocketType> extends OutputNodeSocketProps {
  kind: NodeKind
}

function OutputNamedSocket<NodeKind extends OutputSocketType>(props: Props<NodeKind>) {
  const withNodeIndex = useNodeIndex()
  const outputs = useContext(OutputsPost);

  createEffect(() => {
    if (outputs === undefined) return;
    withNodeIndex(node_id => {
      const [, upd] = outputs;
      upd({ [node_id]: { [props.name]: props.kind } })
    })
  })

  return <OutputNodeSocket {...props}>
    {props.children}
  </OutputNodeSocket>
}

export default OutputNamedSocket;
