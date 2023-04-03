// import { Quaternion, Vector3 } from 'three';
// import { MessageBufferPool } from '../messages/message-buffer';
// import { GameCore } from './types';

// export const createGameCore = async (messageBuffer: MessageBufferPool): Promise<GameCore> => {
//   return {
//     start: () => {
//       // empty
//     },
//     dispose: () => {
//       // empty
//     },
//     requestUpdateMessage: () => {
//       //
//     },
//     inputs: {
//       head: {
//         position: new Vector3(),
//         quaternion: new Quaternion(),
//       },
//       handJoints: [],
//     },
//   };
// };

export { createGameCore } from './prototype/game-core';
