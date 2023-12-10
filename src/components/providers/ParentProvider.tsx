import {
  Accessor,
  JSX,
  ParentComponent,
  ParentProps
} from 'solid-js';
import NodesProvider from './NodesProvider';
import OutputsProvider from '@/components/providers/OutputProvider';

const contexts: ParentComponent[] = [
  // NOTE: Orders Matter
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
