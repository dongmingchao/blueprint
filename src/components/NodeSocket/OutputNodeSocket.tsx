import NodeSocket, { useValuesData } from './NodeSocket';
import { SocketsData } from './SocketsData';
import css from './NodeSocket.module.styl';
import { Props as NodeSocketProps } from './NodeSocket';

export interface Props extends NodeSocketProps { }

function OutputNodeSocket(props: Props) {
  const test = useValuesData()?.output;
  console.log('output node socket render');

  return (
    <SocketsData.Provider value={test}>
      <NodeSocket {...props} class={css.output}>
        {props.children}
      </NodeSocket>
    </SocketsData.Provider>
  );
}

export default OutputNodeSocket;
