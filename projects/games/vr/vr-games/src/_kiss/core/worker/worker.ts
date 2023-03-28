import { createGame_PunchDefense } from '../../game/punch-defense';
import { postMessageFromWorker } from '../messages/message';
import { createMessageBufferPool } from '../messages/message-buffer';
import { MessageBufferKind, WorkerMessageFromWorker, WorkerMessageToWorker } from '../messages/message-type';
import { readMessageUserInputTransforms } from '../messages/messages/message-user-input';
import { GameEngine, GameWorkerEngine } from './types';
import { wogger } from './wogger';
import { createWorkerEngine } from './worker-engine';

wogger.log(`I am loaded!`, {});

const state = {
  ready: false,
  timeToMainTime: 0,
  messageBufferPool: createMessageBufferPool(self),
  gameWorkerEngine: undefined as undefined | GameWorkerEngine,
  gameEngine: undefined as undefined | GameEngine,
};

self.onmessage = (e: { data: unknown }) => {
  const data = e.data as WorkerMessageToWorker;
  if (data instanceof ArrayBuffer) {
    const i32Buffer = new Int32Array(data);
    const kind = i32Buffer[0] as MessageBufferKind;
    if (kind === MessageBufferKind.returnedBuffer) {
      state.messageBufferPool.addReturnedBuffer(data);
      return;
    }
    if (kind === MessageBufferKind.userInputTransforms) {
      if (!state.gameWorkerEngine) {
        state.messageBufferPool.returnBuffer(data);
        return;
      }
      readMessageUserInputTransforms(data, state.gameWorkerEngine.inputs);
      state.messageBufferPool.returnBuffer(data);
      return;
    }

    wogger.error(`Unhandled ArrayBuffer from [Main]`, { data });
    state.messageBufferPool.returnBuffer(data);
    return;
  }
  if (data.kind === `setup`) {
    if (state.ready) {
      return;
    }
    state.ready = true;

    const bufferPool = state.messageBufferPool;
    (async () => {
      state.gameWorkerEngine = await createWorkerEngine(bufferPool);
      // state.gameEngine = createGame_RoomOfBlocks({ engine: state.gameWorkerEngine });
      state.gameEngine = createGame_PunchDefense({ engine: state.gameWorkerEngine });
      state.gameWorkerEngine.start(state.gameEngine);
      wogger.log(`I am setup!`);
    })();
    return;
  }
  if (data.kind === `dispose`) {
    state.ready = false;
    state.gameWorkerEngine?.dispose();
    state.gameWorkerEngine = undefined;
    state.gameEngine = undefined;
    wogger.log(`I am in-disposed`);
    return;
  }
  if (data.kind === `frameSync`) {
    if (!state.gameWorkerEngine) {
      return;
    }
    state.gameWorkerEngine.updateMessageRequested = true;
    // wogger.log(`Update requested from [Main]`);
    return;
  }
  if (data.kind === `ping`) {
    const timeActual = performance.now();
    const timeToMainTime = data.time - timeActual;
    if (!state.timeToMainTime) {
      state.timeToMainTime = timeToMainTime;
    }
    state.timeToMainTime = 0.5 * state.timeToMainTime + 0.5 * timeToMainTime;

    const time = timeActual + state.timeToMainTime;
    const pong: WorkerMessageFromWorker = {
      kind: `pong`,
      pingTime: data.time,
      time,
      timeActual,
      timeOffset: state.timeToMainTime,
    };
    wogger.log(`ping from [Main]`, { pong });
    postMessageFromWorker(pong);
    return;
  }

  wogger.log(`UNKNOWN Message received from [Main]`, { data });
};
