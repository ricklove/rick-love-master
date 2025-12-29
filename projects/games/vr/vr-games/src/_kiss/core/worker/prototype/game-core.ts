import { MessageBufferPool } from '../../messages/message-buffer';
import { GameCore } from '../types';
import { createGame_PunchDefense } from './game/punch-defense';
import { createWorkerEngine } from './worker-engine';

export const createGameCore = async (messageBuffer: MessageBufferPool): Promise<GameCore> => {
  const gameWorkerEngine = await createWorkerEngine(messageBuffer);
  const gameEngine = createGame_PunchDefense({ engine: gameWorkerEngine });

  return {
    start: () => {
      gameWorkerEngine.start(gameEngine);
    },
    dispose: () => {
      gameWorkerEngine.dispose();
    },
    requestUpdateMessage: () => {
      gameWorkerEngine.updateMessageRequested = true;
    },
    inputs: gameWorkerEngine.inputs,
  };
};
