import { Object3D, Quaternion, Vector3 } from 'three';
import { MessageBufferPool } from '../message-buffer';
import { MessageBufferKind } from '../message-type';

const bufferKind = MessageBufferKind.sceneObjectTransforms;

const getBufferSize = (boxCount: number, sphereCount: number) => {
  return (
    4 + // buffer kind
    4 + // box count
    4 + // sphere count
    boxCount * 8 * 4 + // id(1) + position(3) + quaternion(4)
    sphereCount * 4 * 4 // id(1) + position(3)
  );
};

export const postMessageSceneObjectTransforms = (
  boxes: {
    id: number;
    position: Vector3;
    quaternion: Quaternion;
  }[],
  spheres: {
    id: number;
    position: Vector3;
  }[],
  bufferPool: MessageBufferPool,
) => {
  const size = getBufferSize(boxes.length, spheres.length);
  const buffer = bufferPool.claimBuffer(size);
  const fBuffer = new Float32Array(buffer);
  const iBuffer = new Int32Array(buffer);

  // wogger.log(`postMessageArrayBufferFromWorker`, { boxes, spheres, buffer, fBuffer, iBuffer });

  let offset = 0;
  iBuffer[offset++] = bufferKind;
  iBuffer[offset++] = boxes.length;
  iBuffer[offset++] = spheres.length;

  for (const box of boxes) {
    iBuffer[offset++] = box.id;
    fBuffer[offset++] = box.position.x;
    fBuffer[offset++] = box.position.y;
    fBuffer[offset++] = box.position.z;
    fBuffer[offset++] = box.quaternion.x;
    fBuffer[offset++] = box.quaternion.y;
    fBuffer[offset++] = box.quaternion.z;
    fBuffer[offset++] = box.quaternion.w;
  }

  for (const sphere of spheres) {
    iBuffer[offset++] = sphere.id;
    fBuffer[offset++] = sphere.position.x;
    fBuffer[offset++] = sphere.position.y;
    fBuffer[offset++] = sphere.position.z;
  }

  bufferPool.postMessage(buffer);
};

export const readMessageSceneObjectTransforms = (buffer: ArrayBuffer, boxes: Object3D[], spheres: Object3D[]) => {
  const f32Buffer = new Float32Array(buffer);
  const i32Buffer = new Int32Array(buffer);

  let offset = 0;
  const _kind = i32Buffer[offset++];
  if (_kind !== bufferKind) {
    console.error(`readMessageSceneObjectTransforms: wrong kind`, { _kind, bufferKind });
  }
  const boxCount = i32Buffer[offset++];
  const sphereCount = i32Buffer[offset++];

  //   console.log(`readMessageSceneObjectTransforms`, {
  //     _kind,
  //     boxCount,
  //     sphereCount,
  //     buffer,
  //     f32Buffer,
  //     i32Buffer,
  //   });

  for (let i = 0; i < boxCount; i++) {
    const id = i32Buffer[offset++];
    const box = boxes[id];
    if (!box) {
      console.error(`readMessageSceneObjectTransforms: box not found`, { id, box, i32Buffer, offset });
    }
    box.position.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    box.quaternion.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    box.updateMatrix();
  }

  for (let i = 0; i < sphereCount; i++) {
    const id = i32Buffer[offset++];
    const sphere = spheres[id];
    if (!sphere) {
      console.error(`readMessageSceneObjectTransforms: sphere not found`, { id, sphere });
    }
    sphere.position.set(f32Buffer[offset++], f32Buffer[offset++], f32Buffer[offset++]);
    sphere.updateMatrix();
  }
};
