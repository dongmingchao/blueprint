import {
  Accessor,
  JSX,
  ParentComponent,
  ParentProps
} from 'solid-js';
import NodesProvider from './NodesProvider';
import ValuesProvider from './ValuesProvider';
import OutputsProvider from '@/core/OutputProvider';

const contexts: ParentComponent[] = [
  ValuesProvider,
  NodesProvider,
  OutputsProvider,
];

function ParentProvider(props: ParentProps) {
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
