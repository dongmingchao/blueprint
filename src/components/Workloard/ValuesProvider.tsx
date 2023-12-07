import { ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ValuesData } from '../NodeSocket/SocketsData';


function ValuesProvider(props: ParentProps) {
  const values = [{
    inputs: createStore({}),
    outputs: createStore({}),
  }, {
    inputs: createStore({}),
    outputs: createStore({}),
  }, {
    inputs: createStore({}),
    outputs: createStore({}),
  }, {
    inputs: createStore({}),
    outputs: createStore({}),
  }];
  console.info('[Render]::ValuesProvider Render');

  return (
    <div>ValuesProvider
      <ValuesData.Provider value={values}>
        {props.children}
      </ValuesData.Provider>
    </div>
  );
}

export default ValuesProvider;
