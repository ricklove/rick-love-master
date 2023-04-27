import * as THREE from 'three';
import { Object3D } from 'three';
import { preloadFont, Text } from 'troika-three-text';
import { delay } from '@ricklove/utils-core';
import { logger } from '../../utils/logger';
import { createMusicSequenceLoader, MusicSequenceData } from './ecs/components/music-sequence-loader';
import { postMessageUserInputTransforms } from './input/message-user-input';
import { setupMouseInput } from './input/mouse';
import { createMessageBufferPool } from './messages/message-buffer';
import { MessageBufferKind, WorkerMessageFromWorker, WorkerMessageToWorker } from './messages/message-type';
import { readMessageSceneObjectTransforms } from './messages/messages/message-scene-object-transforms';
import { setupThree } from './three-setup';
import { addTestScene, updateTestScene } from './three-test-scene';

type TroikaText = THREE.Object3D & {
  text: string;
  fontSize: number;
  position: { z: number };
  color: number;
  anchorX: string;
  anchorY: string;
  sync: () => void;
};

export const createGameEngine = (host: HTMLDivElement, workerRaw: Worker) => {
  // [MainLoop] Read input from web-xr
  // [MainLoop] Send data to [Worker]
  // [MainLoop] Use updated transforms from [Worker] to update Three Objects
  // [MainLoop] Render Three
  // [Worker] Receive inputs from [Main] and store quickly
  // [WorkerLoop] Step rapier physics at constant fps (based on current performance measurements)
  // [WorkerLoop] At sync time (once per MainLoop fps), send changed transforms to [Main] (filter out sub pixel changes, based on camera position)
  // [Main] Receive transforms from [Worker] and store quickly

  const worker = workerRaw as {
    postMessage: (message: WorkerMessageToWorker) => void;
    onmessage: (e: MessageEvent<WorkerMessageFromWorker>) => void;
  };

  const setup = () => {
    const { scene, camera, renderer, dispose, state, audioState } = setupThree(host);
    const testScene = addTestScene(scene, renderer);
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereGeometry(1);

    // preload troika font
    preloadFont(
      {
        // font:
        // characters: 'abcdefghijklmnopqrstuvwxyz'
      },
      () => {
        // ready
      },
    );

    const objectMap = [] as (undefined | Object3D)[];
    let addObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `addObjects` }>;
    let removeObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `removeObjects` }>;
    let updateObjectsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `updateObjects` }>;
    let updateObjectsArrayBuffer = undefined as undefined | ArrayBuffer;
    let loadMusicData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `loadMusic` }>;
    let playMusicData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `playMusic` }>;
    let setTextsData = undefined as undefined | Extract<WorkerMessageFromWorker, { kind: `setTexts` }>;

    const musicLoader = createMusicSequenceLoader(`/ddr`);
    const _musicList = musicLoader.getSongs();
    const musicState = [] as {
      loading: boolean;
      song: MusicSequenceData;
      buffer: AudioBuffer;
    }[];

    const updateSceneFromData = () => {
      if (addObjectsData) {
        const data = addObjectsData;
        addObjectsData = undefined;

        data.boxes?.forEach((o) => {
          const object = new THREE.Mesh(boxGeometry, new THREE.MeshLambertMaterial({ color: o.color }));
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.quaternion.set(o.quaternion[0], o.quaternion[1], o.quaternion[2], o.quaternion[3]);
          object.scale.set(o.scale[0], o.scale[1], o.scale[2]);
          object.updateMatrix();

          scene.add(object);

          objectMap[o.id] = object;
        });
        data.spheres?.forEach((o) => {
          const object = new THREE.Mesh(sphereGeometry, new THREE.MeshLambertMaterial({ color: o.color }));
          // const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: 0xff0000 }));
          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.scale.set(o.radius, o.radius, o.radius);
          object.updateMatrix();

          scene.add(object);

          objectMap[o.id] = object;
        });
        data.texts?.forEach((o) => {
          const fontSize = o.fontSize;

          const textObj = new Text() as TroikaText;
          textObj.text = o.text;
          textObj.fontSize = fontSize;
          textObj.position.z = 0;
          textObj.color = o.color;
          textObj.anchorX = o.alignment;
          textObj.anchorY = o.verticalAlignment === `center` ? `middle` : o.verticalAlignment;
          // textObj.alignment
          textObj.sync();

          const object = new THREE.Group();
          object.add(textObj);

          object.matrixAutoUpdate = false;
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.updateMatrix();

          scene.add(object);

          objectMap[o.id] = object;
        });

        logger.log(`updateSceneFromData:addObjects Added objects to scene`, { data, objectMap });
      }
      if (setTextsData) {
        const data = setTextsData;
        setTextsData = undefined;

        data.texts.forEach((o) => {
          const obj = objectMap[o.id] as THREE.Group;
          const textObj = obj?.children[0] as TroikaText;

          if (!textObj) {
            return;
          }

          textObj.text = o.text;
          textObj.sync();
        });
      }
      if (removeObjectsData) {
        const data = removeObjectsData;
        removeObjectsData = undefined;
        data.objectIds.forEach((id) => {
          const object = objectMap[id];
          if (!object) {
            return;
          }
          scene.remove(object);
          objectMap[id] = undefined;
        });
      }
      if (updateObjectsData) {
        const data = updateObjectsData;
        updateObjectsData = undefined;

        data.boxes.forEach((o) => {
          const object = objectMap[o.id];
          if (!object) {
            return;
          }
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.quaternion.set(o.quaternion[0], o.quaternion[1], o.quaternion[2], o.quaternion[3]);
          object.updateMatrix();
          // object.scale.set(o.scale[0], o.scale[1], o.scale[2]);
        });
        data.spheres.forEach((o) => {
          const object = objectMap[o.id];
          if (!object) {
            return;
          }
          object.position.set(o.position[0], o.position[1], o.position[2]);
          object.updateMatrix();
        });
      }
      if (updateObjectsArrayBuffer) {
        const data = updateObjectsArrayBuffer;
        updateObjectsArrayBuffer = undefined;
        // logger.log(`updateObjectsArrayBuffer`, { data, objectMap });
        readMessageSceneObjectTransforms(data, objectMap);
        bufferPool.returnBuffer(data);
      }

      const loadMusic = async (index: number) => {
        while (musicState[index]?.loading) {
          await delay(10);
        }
        if (musicState[index]) {
          return musicState[index];
        }
        musicState[index] = { loading: true } as (typeof musicState)[0];
        const songs = await musicLoader.getSongs();
        const songInfo = songs[index];
        if (!songInfo) {
          console.error(`could not find music`, { index, songInfo });
          return;
        }

        const song = await musicLoader.loadSong(songInfo.key);
        const musicFilePath = song.musicFilePath;
        const buffer = await audioState.load(musicFilePath);

        // eslint-disable-next-line require-atomic-updates
        const result = (musicState[index] = {
          loading: false,
          song,
          buffer,
        });

        console.log(`loaded music`, { index, songName: result.song.songName });

        return result;
      };

      const playMusic = async (index: number) => {
        const music = await loadMusic(index);
        if (!music) {
          console.error(`could not find music`, { index, music });
          return;
        }

        console.log(`playing music`, { index, songName: music.song.songName });
        audioState.play(music.buffer);

        // beatCalculator.setPath(path);
      };

      if (loadMusicData) {
        const data = loadMusicData;
        loadMusicData = undefined;

        // eslint-disable-next-line no-void
        void loadMusic(data.musicId);
      }
      if (playMusicData) {
        const data = playMusicData;
        playMusicData = undefined;

        // eslint-disable-next-line no-void
        void playMusic(data.musicId);
      }
    };

    worker.onmessage = (e) => {
      // logger.log(`From [Worker]`, { e });
      const data = e.data as WorkerMessageFromWorker;
      if (data instanceof ArrayBuffer) {
        // logger.log(`ArrayBuffer from [Worker]`, { e });
        const kind = new Int32Array(data, 0, 1)[0];
        if (kind === MessageBufferKind.returnedBuffer) {
          bufferPool.addReturnedBuffer(data);
          return;
        }
        if (kind === MessageBufferKind.sceneObjectTransforms) {
          if (updateObjectsArrayBuffer) {
            bufferPool.returnBuffer(updateObjectsArrayBuffer);
          }
          updateObjectsArrayBuffer = data;
          return;
        }
        logger.error(`Unhandled ArrayBuffer from [Worker]`, { e });
        bufferPool.returnBuffer(data);
        return;
      }
      if (data.kind === `pong`) {
        logger.log(`pong from [Worker]`, {
          pingTime: data.pingTime,
          time: data.time,
          delta: data.time - data.pingTime,
        });
        return;
      }
      if (data.kind === `addObjects`) {
        // logger.log(`addObjects from [Worker]`, { e });
        addObjectsData = data;
        return;
      }
      if (data.kind === `removeObjects`) {
        // logger.log(`addObjects from [Worker]`, { e });
        removeObjectsData = data;
        return;
      }
      if (data.kind === `updateObjects`) {
        // logger.log(`updateObjects from [Worker]`, { e });
        updateObjectsData = data;
        return;
      }
      if (data.kind === `loadMusic`) {
        loadMusicData = data;
        return;
      }
      if (data.kind === `playMusic`) {
        playMusicData = data;
        return;
      }
      if (data.kind === `setTexts`) {
        setTextsData = data;
        return;
      }
      if (data.kind === `navigateToUrl`) {
        const url = data.url;
        setTimeout(() => {
          window.location.href = url;
        }, 0);
        return;
      }

      const _exhaustiveCheck: never = data;
      logger.error(`Unhandled message from [Worker]`, { e });
    };

    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({ kind: `ping`, time: performance.now() });
    worker.postMessage({
      kind: `setup`,
      params:
        location.search
          ?.split(`?`)[1]
          ?.split(`&`)
          .map((x) => x.split(`=`))
          .map(([k, v]) => ({ key: k, value: v })) ?? [],
    });

    const mouseInput = setupMouseInput();

    const bufferPool = createMessageBufferPool(workerRaw);

    // const beatCalculator = createAudioBeatCalculator();
    // beatCalculator.setup(audioState.audio);

    // const simfiles = createSimfileService(`/`);

    let frameCount = 0;
    let fpsRunningAverage = 60;
    let stop = false;
    let disposed = false;
    let lastFrameTime = performance.now();

    const autoPlayId = 0;
    const autoPlayTimeoutId = undefined as undefined | number | NodeJS.Timeout;

    const mainLoop: XRFrameRequestCallback = (time, frame) => {
      if (disposed) {
        return;
      }
      if (stop) {
        disposed = true;
        logger.log(`mainLoop STOPPED`, { frameCount, fpsRunningAverage });
        worker.postMessage({ kind: `dispose` });
        dispose();
        return;
      }

      const frameTime = time; // performance.now();
      //console.log(`frameTime`, { time, frameTime, lastFrameTime });
      const deltaTime = frameTime - lastFrameTime;
      lastFrameTime = frameTime;

      const fps = 1000 / (deltaTime || 1);
      fpsRunningAverage = 0.9 * fpsRunningAverage + 0.1 * fps;

      worker.postMessage({ kind: `frameSync`, time: frameTime });

      if (frameCount % (10 * 60) === 0) {
        logger.log(`mainLoop`, { frameCount, deltaTime, fps, fpsRunningAverage });
        worker.postMessage({ kind: `ping`, time: frameTime });
      }

      postMessageUserInputTransforms(renderer, frame, bufferPool, mouseInput.mouseState, camera);

      updateSceneFromData();
      updateTestScene(deltaTime, testScene);
      renderer.render(scene, camera);

      // audio analyser
      // beatCalculator.update();

      // const autoPlay = false;
      // if (autoPlay && !audioState.audio.isPlaying && !autoPlayTimeoutId) {
      //   autoPlayTimeoutId = setTimeout(() => {
      //     autoPlayTimeoutId = undefined;
      //     const path = musicList[autoPlayId++]?.path;
      //     if (path) {
      //       // eslint-disable-next-line no-void
      //       void audioState.load(path).then((buffer) => {
      //         audioState.play(buffer);
      //         beatCalculator.setPath(path);
      //       });
      //     }
      //   }, 1000);
      // }

      frameCount++;
    };

    const animate = () => {
      renderer.setAnimationLoop(mainLoop);
    };

    return {
      animate,
      dispose: () => {
        mouseInput.unsubscribe();
        stop = true;
      },
    };
  };

  return { setup };
};
