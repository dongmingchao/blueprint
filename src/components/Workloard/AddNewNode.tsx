import { createNodesData } from '@/core/register';
import { dispatchAddNode } from '../providers/NodesProvider';
// import { useSaveNode } from '../providers/StorageProvider';

function AddNewNode() {
  // const { add } = useSaveNode();
  const addNode = dispatchAddNode()

  function onAddPress() {
    // add({
    //   importedKind: 'NodeAdd',
    //   transform: { left: 0, top: 0 },
    // })
    addNode(createNodesData({
      importedKind: 'NodeAdd',
      transform: { left: 0, top: 0 },
    }))
  }

  return <div>
    <button type="button" onPointerDown={onAddPress}>Add</button>
  </div>
}

export default AddNewNode;
