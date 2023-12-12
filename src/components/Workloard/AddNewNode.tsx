import { SerializableNode } from '@/core/register';
import { dispatchAddNode } from '../providers/NodesProvider';
import css from './AddNewNode.module.styl';

function AddNewNode() {
  const addNode = dispatchAddNode()

  function onAddPress(kind: SerializableNode['importedKind']) {
    return function () {
      addNode({
        importedKind: kind,
        transform: { left: 0, top: 0 },
      })
    }
  }

  return <div>
    <button
      class={css['base-button']}
      type="button"
      onPointerDown={onAddPress('NodeAdd')}>
        Add
    </button>
    <button
      class={css['base-button']}
      type="button"
      onPointerDown={onAddPress('NodeLabel')}>
        Label
    </button>
    <button
      class={css['base-button']}
      type="button"
      onPointerDown={onAddPress('NodeString')}>
        String
    </button>
  </div>
}

export default AddNewNode;
