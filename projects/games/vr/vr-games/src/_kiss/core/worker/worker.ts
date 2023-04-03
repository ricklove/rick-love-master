import { postMessageFromWorker } from '../messages/message';
import { createMessageBufferPool } from '../messages/message-buffer';
import { MessageBufferKind, WorkerMessageFromWorker, WorkerMessageToWorker } from '../messages/message-type';
import { readMessageUserInputTransforms } from '../messages/messages/message-user-input';
import { createGameCore } from './game-core';
import { GameCore } from './types';
import { wogger } from './wogger';

wogger.log(`I am loaded!`, {});

const state = {
  ready: false,
  timeToMainTime: 0,
  messageBufferPool: createMessageBufferPool(self),
  gameCore: undefined as undefined | GameCore,
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
      if (!state.gameCore) {
        state.messageBufferPool.returnBuffer(data);
        return;
      }
      readMessageUserInputTransforms(data, state.gameCore.inputs);
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
      state.gameCore = await createGameCore(bufferPool);
      state.gameCore.start();
      wogger.log(`I am setup!`);
    })();
    return;
  }
  if (data.kind === `dispose`) {
    state.ready = false;
    state.gameCore?.dispose();
    state.gameCore = undefined;
    wogger.log(`I am in-disposed`);
    return;
  }
  if (data.kind === `frameSync`) {
    if (!state.gameCore) {
      return;
    }
    state.gameCore.requestUpdateMessage();
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
