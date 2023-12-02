import NodeSocket, { useValuesData } from './NodeSocket';
import { SocketsData } from './SocketsData';
import css from './NodeSocket.module.styl';
import { Props as NodeSocketProps } from './NodeSocket';

export interface Props extends NodeSocketProps { }

function InputNodeSocket(props: Props) {
  const test = useValuesData()?.input;
  console.info('[Render]::InputNodeSocket Render');

  return (
    <SocketsData.Provider value={test}>
      <NodeSocket {...props} class={css.input}>
        {props.children}
      </NodeSocket>
    </SocketsData.Provider>
  );
}

export default InputNodeSocket;
