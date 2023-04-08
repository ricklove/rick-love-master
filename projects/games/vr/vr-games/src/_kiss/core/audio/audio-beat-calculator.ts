import * as THREE from 'three';

export const createAudioBeatCalculator = () => {
  // TODO: disable if not used in real time
  const state = {
    audio: undefined as undefined | THREE.Audio,
    audioAnalyser: undefined as undefined | THREE.AudioAnalyser,
    buckets: [] as boolean[],
    //topBuckets: [] as number[],
    top: ``,
  };

  return {
    setup: (audio: THREE.Audio) => {
      state.audio = audio;
      const audioAnalyser = (state.audioAnalyser = new THREE.AudioAnalyser(audio, 1024));
      audioAnalyser.analyser.minDecibels = -40;
      audioAnalyser.analyser.maxDecibels = -10;
      audioAnalyser.analyser.smoothingTimeConstant = 0;
    },
    update: () => {
      if (!state.audio || !state.audio.isPlaying || !state.audioAnalyser) {
        return;
      }

      const { audioAnalyser } = state;
      audioAnalyser.getFrequencyData();
      const data = audioAnalyser.data;

      //   const hitIndexes = [...data]
      //     .map((x, i) => ({ x, i }))
      //     .filter((x) => x.x > 32)
      //     .sort((a, b) => a.x - b.x)
      //     .slice(0, 2);

      //   const topStr = hitIndexes.map((x) => `${x.i}`).join(`,`);
      //   if (topStr !== state.top) {
      //     console.log(`topStr`, topStr);
      //     // console.log(`hitIndexes`, hitIndexes.map((x) => `${x.i}:${x.x.toString(16)}`).join(`, `));
      //     state.top = topStr;
      //   }

      //   const topBuckets = [...data].map

      for (let i = 0; i < data.length; i++) {
        const value = data[i];
        const isHit = value > 128;
        const wasHit = state.buckets[i];
        state.buckets[i] = isHit;

        if (isHit !== wasHit) {
          console.log(`hit change ${isHit ? `OOO` : `...`} [${i}] @${value}`);
        }
      }

      //   const hitIndexes = [...data].map((x, i) => ({ x, i })).filter((x) => x.x > 128);

      //   console.log(`hitIndexes`, hitIndexes.map((x) => `${x.i}:${x.x.toString(16)}`).join(`, `));
    },
  };
};
