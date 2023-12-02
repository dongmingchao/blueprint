import { ParentProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ValuesData } from '../NodeSocket/SocketsData';


function ValuesProvider(props: ParentProps) {
  const values = [{
    input: createStore({}),
    output: createStore({}),
  }, {
    input: createStore({}),
    output: createStore({}),
  }, {
    input: createStore({}),
    output: createStore({}),
  }];
  console.log('ValuesProvider Render');

  return (
    <div>ValuesProvider
      <ValuesData.Provider value={values}>
        {props.children}
      </ValuesData.Provider>
    </div>
  );
}

export default ValuesProvider;
