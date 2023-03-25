import { Object3D, Quaternion, Vector3 } from 'three';
import { WorkerMessageFromWorker } from './message-type';
import { wogger } from './wogger';

export const postMessageFromWorker = (message: WorkerMessageFromWorker) => {
  postMessage(message);
};

export const createMessageArrayBufferSet = (maxBoxCount: number, maxSphereCount: number) => {
  const maxBufferSize = getBufferSize(maxBoxCount, maxSphereCount);
  const buffers = [] as ArrayBuffer[];
  let bufferSize = maxBufferSize;
  while (bufferSize > 4 * 4 * 10) {
    buffers.push(new ArrayBuffer(bufferSize));
    bufferSize = Math.floor(bufferSize * 0.8);
  }
  // smallest buffer first
  buffers.reverse();

  wogger.log(`createMessageArrayBufferSet`, { maxBoxCount, maxSphereCount, maxBufferSize, buffers });

  return {
    buffers,
    getBuffer: (boxCount: number, sphereCount: number) => {
      const size = getBufferSize(boxCount, sphereCount);
      for (const buffer of buffers) {
        if (buffer.byteLength >= size) {
          return buffer;
        }
      }
      const biggerBuffer = new ArrayBuffer(size);
      buffers.push(biggerBuffer);
      return biggerBuffer;
    },
  };
};
export type MessageArrayBufferSet = ReturnType<typeof createMessageArrayBufferSet>;

const getBufferSize = (boxCount: number, sphereCount: number) => {
  return (
    4 + // box count
    4 + // sphere count
    boxCount * 8 * 4 + // id + position(3) + quaternion(4)
    sphereCount * 4 * 4 // id + position(3)
  );
};

export const postMessageArrayBufferFromWorker = (
  boxes: {
    id: number;
    position: Vector3;
    quaternion: Quaternion;
  }[],
  spheres: {
    id: number;
    position: Vector3;
  }[],
  bufferSet: MessageArrayBufferSet,
) => {
  const buffer = bufferSet.getBuffer(boxes.length, spheres.length);
  const fBuffer = new Float32Array(buffer);
  const iBuffer = new Int32Array(buffer);

  // wogger.log(`postMessageArrayBufferFromWorker`, { boxes, spheres, buffer, fBuffer, iBuffer });

  iBuffer[0] = boxes.length;
  iBuffer[1] = spheres.length;

  let offset = 2;
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

  postMessage(buffer);
};

export const readMessageArrayBufferFromWorker = (buffer: ArrayBuffer, boxes: Object3D[], spheres: Object3D[]) => {
  const fBuffer = new Float32Array(buffer);
  const iBuffer = new Int32Array(buffer);

  const boxCount = iBuffer[0];
  const sphereCount = iBuffer[1];

  console.log(`readMessageArrayBufferFromWorker`, { boxCount, sphereCount, buffer, fBuffer, iBuffer });

  let offset = 2;
  for (let i = 0; i < boxCount; i++) {
    const id = iBuffer[offset++];
    const box = boxes[id];
    box.position.set(fBuffer[offset++], fBuffer[offset++], fBuffer[offset++]);
    box.quaternion.set(fBuffer[offset++], fBuffer[offset++], fBuffer[offset++], fBuffer[offset++]);
  }

  for (let i = 0; i < sphereCount; i++) {
    const id = iBuffer[offset++];
    const sphere = spheres[id];
    sphere.position.set(fBuffer[offset++], fBuffer[offset++], fBuffer[offset++]);
  }
};
