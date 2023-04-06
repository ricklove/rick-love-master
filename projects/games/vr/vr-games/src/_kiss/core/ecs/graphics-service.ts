import { Quaternion, Vector3 } from 'three';
import { postMessageFromWorker } from '../messages/message';
import { MessageBufferPool } from '../messages/message-buffer';
import { postMessageSceneObjectTransforms } from '../messages/messages/message-scene-object-transforms';

export type GraphicsService = {
  addObject: (args: {
    shape: 'box' | 'sphere' | 'text';
    visible: boolean;
    position: [number, number, number];
    quaternion: [number, number, number, number];
    scale: [number, number, number];
    color: number;
    text?: {
      text: string;
      fontSize: number;
      alignment: 'left' | 'center' | 'right';
      verticalAlignment: 'top' | 'center' | 'bottom';
    };
  }) => { id: number };
  removeObject: (id: number) => void;
  setVisible: (id: number, visible: boolean) => void;
  setTransform: (id: number, position: [number, number, number], quaternion: [number, number, number, number]) => void;
};

// Batch everything until requestUpdateMessage
export const createGraphicsService = (
  messageBufferPool: MessageBufferPool,
): GraphicsService & { sendMessages: () => void } => {
  const allObjects = [] as {
    hasChanged: boolean;
    destroyed: boolean;
    id: number;
    shape: 'box' | 'sphere' | 'text';
    visible: boolean;
    position: Vector3;
    quaternion: Quaternion;
    scale: Vector3;
    color: number;
    text?: {
      text: string;
      fontSize: number;
      alignment: 'left' | 'center' | 'right';
      verticalAlignment: 'top' | 'center' | 'bottom';
    };
  }[];
  const objectsToAdd = [] as typeof allObjects;
  const objectsToDestroy = [] as {
    id: number;
  }[];

  const sendMessages = () => {
    if (objectsToDestroy.length) {
      postMessageFromWorker({
        kind: `removeObjects`,
        objectIds: objectsToDestroy.map((x) => x.id),
      });
      objectsToDestroy.length = 0;
    }

    if (objectsToAdd.length) {
      postMessageFromWorker({
        kind: `addObjects`,
        boxes: objectsToAdd
          .filter((x) => x.shape === `box`)
          .map((x) => ({
            id: x.id,
            position: x.position.toArray(),
            quaternion: x.quaternion.toArray() as [number, number, number, number],
            scale: x.scale.toArray(),
            color: x.color,
          })),
        spheres: objectsToAdd
          .filter((x) => x.shape === `sphere`)
          .map((x) => ({
            id: x.id,
            position: x.position.toArray(),
            quaternion: x.quaternion.toArray(),
            radius: x.scale.x,
            color: x.color,
          })),
        texts: objectsToAdd
          .filter((x) => x.shape === `text`)
          .map((x) => ({
            id: x.id,
            position: x.position.toArray(),
            quaternion: x.quaternion.toArray() as [number, number, number, number],
            radius: x.scale.x,
            color: x.color,
            text: x.text?.text!,
            fontSize: x.text?.fontSize!,
            alignment: x.text?.alignment!,
            verticalAlignment: x.text?.verticalAlignment!,
          })),
      });
      objectsToAdd.length = 0;
    }

    postMessageSceneObjectTransforms(
      allObjects.filter((x) => !x.destroyed && x.hasChanged),
      messageBufferPool,
    );
  };

  return {
    sendMessages,
    addObject: (args) => {
      const id = allObjects.length;
      const obj = {
        ...args,
        id,
        destroyed: false,
        hasChanged: false,
        position: new Vector3(args.position[0], args.position[1], args.position[2]),
        quaternion: new Quaternion(args.quaternion[0], args.quaternion[1], args.quaternion[2], args.quaternion[3]),
        scale: new Vector3(args.scale[0], args.scale[1], args.scale[2]),
      };
      allObjects.push(obj);
      objectsToAdd.push(obj);
      return { id };
    },
    removeObject: (id) => {
      const obj = allObjects[id];
      obj.destroyed = true;
      obj.hasChanged = false;
      objectsToDestroy.push(obj);
    },
    setVisible: (id, visible) => {
      const obj = allObjects[id];
      obj.visible = visible;
      obj.hasChanged = true;
    },
    setTransform: (id, position, quaternion) => {
      const obj = allObjects[id];
      obj.position.x = position[0];
      obj.position.y = position[1];
      obj.position.z = position[2];
      obj.quaternion.x = quaternion[0];
      obj.quaternion.y = quaternion[1];
      obj.quaternion.z = quaternion[2];
      obj.quaternion.w = quaternion[3];
      obj.hasChanged = true;
    },
  };
};
