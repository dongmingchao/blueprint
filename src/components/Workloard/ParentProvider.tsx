import {
  Accessor,
  JSX,
  ParentComponent,
  ParentProps
} from 'solid-js';
import NodesProvider from './NodesProvider';
import ValuesProvider from './ValuesProvider';
import OutputsProvider from '@/core/OutputProvider';

function ParentProvider(props: ParentProps) {
  const contexts: ParentComponent[] = [ValuesProvider, NodesProvider, OutputsProvider];
  console.log('ParentProvider Render');

  const c = contexts.reduce(
    (pv: Accessor<JSX.Element>, Cv: ParentComponent) => {
      return () => Cv({
        get children() {
          return pv();
        }
      });
    }, () => props.children);
  return <>{c}</>;
}

export default ParentProvider;
