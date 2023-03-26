import { Quaternion, Vector3 } from 'three';
import { GameEngine, GameWorkerEngine } from '../core/worker/types';

export const createGame_RoomOfBlocks = ({ engine: { createEntity } }: { engine: GameWorkerEngine }): GameEngine => {
  const roomSize = 5;
  const roomHeight = 2;
  const boxSize = 0.3;
  const boxCount = 1000;

  const entities = {
    room: {
      ground: createEntity({
        type: `ground` as const,
        kind: `fixed` as const,
        shape: `box` as const,
        position: new Vector3(0, 0, 0),
        scale: new Vector3(roomSize, 0.1, roomSize),
      }),
      ceiling: createEntity({
        type: `ceiling` as const,
        kind: `fixed` as const,
        shape: `box` as const,
        position: new Vector3(0, roomHeight, 0),
        scale: new Vector3(roomSize, 0.1, roomSize),
      }),
      wallW: createEntity({
        type: `wall` as const,
        kind: `fixed` as const,
        shape: `box` as const,
        position: new Vector3(-roomSize * 0.5, roomHeight * 0.5, 0),
        scale: new Vector3(0.1, roomHeight, roomSize),
      }),
      wallE: createEntity({
        type: `wall` as const,
        kind: `fixed` as const,
        shape: `box` as const,
        position: new Vector3(roomSize * 0.5, roomHeight * 0.5, 0),
        scale: new Vector3(0.1, roomHeight, roomSize),
      }),
      wallN: createEntity({
        type: `wall` as const,
        kind: `fixed` as const,
        shape: `box` as const,
        position: new Vector3(0, roomHeight * 0.5, -roomSize * 0.5),
        scale: new Vector3(roomSize, roomHeight, 0.1),
      }),
      wallS: createEntity({
        type: `wall` as const,
        kind: `fixed` as const,
        shape: `box` as const,
        position: new Vector3(0, roomHeight * 0.5, roomSize * 0.5),
        scale: new Vector3(roomSize, roomHeight, 0.1),
      }),
    },
    boxes: [...new Array(boxCount)]
      .map(() => ({
        type: `box` as const,
        shape: `box` as const,
        position: new Vector3(
          roomSize * (0.5 * (1 - 2 * Math.random())),
          roomHeight * (0.25 + 0.5 * Math.random()),
          roomSize * (0.5 * (1 - 2 * Math.random())),
        ),
        scale: new Vector3(
          boxSize * (0.1 + 0.75 * Math.random()),
          boxSize * (0.1 + 0.75 * Math.random()),
          boxSize * (0.1 + 0.75 * Math.random()),
        ),
        quaternion: new Quaternion(Math.random(), Math.random(), Math.random(), Math.random()).normalize(),
        hasMoved: true,
      }))
      .map(createEntity),
  };

  return {
    update: () => {
      // just physics
    },
  };
};
