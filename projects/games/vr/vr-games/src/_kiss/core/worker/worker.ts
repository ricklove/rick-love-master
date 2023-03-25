import { Vector3 } from 'three';
import { postMessageTyped } from './message';
import { WorkerMessageFromWorker, WorkerMessageToWorker } from './message-type';
import { createWorkerTestScene } from './test-scene';
import { wogger } from './wogger';

wogger.log(`I am loaded!`, {});

const state = {
  ready: false,
  timeToMainTime: 0,
  scene: undefined as undefined | Awaited<ReturnType<typeof createWorkerTestScene>>,
};
const v = new Vector3();

self.onmessage = (e: { data: unknown }) => {
  const data = e.data as WorkerMessageToWorker;
  if (data instanceof ArrayBuffer) {
    const dataFloat32 = new Float32Array(data);
    // TODO: send this to physics
    if (!state.scene) {
      return;
    }
    state.scene.joints.forEach((o, i) => {
      o.rigidBody?.setNextKinematicTranslation(
        v.set(dataFloat32[i * 3], dataFloat32[i * 3 + 1], dataFloat32[i * 3 + 2]),
      );
    });
    // const total = dataFloat32.reduce((a, b) => a + b, 0);
    // wogger.log(`ArrayBuffer received from [Main]`, { dataFloat32 });
    return;
  }
  if (data.kind === `setup`) {
    // TODO: setup resources
    state.ready = true;
    (async () => {
      state.scene = await createWorkerTestScene();
      wogger.log(`I am setup!`);
    })();
    return;
  }
  if (data.kind === `dispose`) {
    // TODO: dispose resources
    state.ready = false;
    state.scene?.dispose();
    state.scene = undefined;
    wogger.log(`I am in-disposed`);
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
    postMessageTyped(pong);
    return;
  }

  wogger.log(`UNKNOWN Message received from [Main]`, { data });
};
