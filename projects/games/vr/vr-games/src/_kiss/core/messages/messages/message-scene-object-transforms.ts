import { Object3D, Quaternion, Vector3 } from 'three';
import { MessageBufferPool } from '../message-buffer';
import { MessageBufferKind } from '../message-type';

const bufferKind = MessageBufferKind.sceneObjectTransforms;

const getBufferSize = (invisibleCount: number, objectCount: number) => {
  return (
    4 + // buffer kind
    4 + // box count
    4 + // sphere count
    invisibleCount * 4 + // id(1) + position(3) + quaternion(4)
    objectCount * 4 * 8 // id(1) + position(3) + quaternion(4)
  );
};

export const postMessageSceneObjectTransforms = (
  objects: {
    id: number;
    visible: boolean;
    position: Vector3;
    quaternion: Quaternion;
  }[],
  bufferPool: MessageBufferPool,
) => {
  const invisibleObjs = objects.filter((obj) => !obj.visible);
  const visibleObjs = objects.filter((obj) => obj.visible);

  const size = getBufferSize(invisibleObjs.length, visibleObjs.length);
  const buffer = bufferPool.claimBuffer(size);
  const fBuffer = new Float32Array(buffer);
  const iBuffer = new Int32Array(buffer);

  // wogger.log(`postMessageArrayBufferFromWorker`, { boxes, spheres, buffer, fBuffer, iBuffer });

  let offset = 0;
  iBuffer[offset++] = bufferKind;

  iBuffer[offset++] = invisibleObjs.length;
  for (const obj of invisibleObjs) {
    iBuffer[offset++] = obj.id;
  }

  iBuffer[offset++] = visibleObjs.length;
  for (const box of visibleObjs) {
    iBuffer[offset++] = box.id;
    fBuffer[offset++] = box.position.x;
    fBuffer[offset++] = box.position.y;
    fBuffer[offset++] = box.position.z;
    fBuffer[offset++] = box.quaternion.x;
    fBuffer[offset++] = box.quaternion.y;
    fBuffer[offset++] = box.quaternion.z;
    fBuffer[offset++] = box.quaternion.w;
  }

  bufferPool.postMessage(buffer);
};

export const readMessageSceneObjectTransforms = (buffer: ArrayBuffer, objectMap: Object3D[]) => {
  const f32Buffer = new Float32Array(buffer);
  const i32Buffer = new Int32Array(buffer);

  let offset = 0;
  const _kind = i32Buffer[offset++];
  if (_kind !== bufferKind) {
    console.error(`readMessageSceneObjectTransforms: wrong kind`, { _kind, bufferKind });
    return;
  }

  //   console.log(`readMessageSceneObjectTransforms`, {
  //     _kind,
  //     boxCount,
  //     sphereCount,
  //     buffer,
  //     f32Buffer,
  //     i32Buffer,
  //   });

  const invisibleCount = i32Buffer[offset++];
  for (let i = 0; i < invisibleCount; i++) {
    const id = i32Buffer[offset++];
    const obj = objectMap[id];
    if (!obj) {
      console.error(`readMessageSceneObjectTransforms: invisible obj not found`, { id, obj, i32Buffer, offset });
      return;
    }
    obj.visible = false;
  }

  const objectCount = i32Buffer[offset++];
  for (let i = 0; i < objectCount; i++) {
    const id = i32Buffer[offset++];
    const obj = objectMap[id];
    if (!obj) {
      console.error(`readMessageSceneObjectTransforms: visible obj not found`, { id, obj, i32Buffer, offset });
      return;
    }
    obj.visible = true;
    obj.position.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    obj.quaternion.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    obj.updateMatrix();
  }
};
