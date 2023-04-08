import * as THREE from 'three';

export const createAudioBeatCalculator = () => {
  // TODO: disable if not used in real time
  const state = {
    audio: undefined as undefined | THREE.Audio,
    audioAnalyser: undefined as undefined | THREE.AudioAnalyser,
    buckets: [] as boolean[],
    bucketsAverages: [] as number[],
    bucketsLast: [] as number[],
    //topBuckets: [] as number[],
    top: ``,
    total: 0,
    totalRunning: 0,
    totalDeltaRunning: 0,
  };

  return {
    setup: (audio: THREE.Audio) => {
      state.audio = audio;
      const audioAnalyser = (state.audioAnalyser = new THREE.AudioAnalyser(audio, 2048));
      audioAnalyser.analyser.minDecibels = -60;
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
      //     .map((x, i) => ({ raw: x, iRaw: i, x: Math.floor(x / 64) * 64, i: Math.floor(i / 8) * 8 }))
      //     .filter((x) => x.x > 32)
      //     .sort((a, b) => a.x - b.x)
      //     .slice(0, 2);

      //   const topStr = hitIndexes.map((x) => `${x.i}`).join(`,`);
      //   if (topStr !== state.top) {
      //     console.log(`topStr`, topStr);
      //     // console.log(`hitIndexes`, hitIndexes.map((x) => `${x.i}:${x.x.toString(16)}`).join(`, `));
      //     state.top = topStr;
      //   }

      let totalDelta = 0;
      for (let i = 0; i < data.length; i++) {
        const value = data[i];

        const delta = value - (state.bucketsLast[i] || 0);
        state.bucketsLast[i] = value;

        // totalDelta += Math.abs(delta);
        totalDelta += Math.sign(delta) * delta * delta;
      }

      //   if (totalDelta > state.totalDeltaRunning * 1.5) {
      //     console.log(`totalDelta`, totalDelta, state.totalDeltaRunning);
      //   }
      //   state.totalDeltaRunning = state.totalDeltaRunning * 0.95 + totalDelta * 0.05;
      const total = totalDelta;

      // const total = data.reduce((a, b) => a + b, 0);
      const diffRatio = (total - state.totalRunning) / state.totalRunning;

      if (diffRatio > 50 && total > 100) {
        console.log(`total`, total, `diffRatio`, diffRatio, `totalRunning`, state.totalRunning);
        state.total = total;
        // spike
        state.totalRunning = state.totalRunning * 0.8 + total * 0.2;
        // state.totalRunning = total;
      } else {
        // bleed off
      }
      state.totalRunning = state.totalRunning * 0.95 + total * 0.05;

      //   const hitIndexes = [...data].map((x, i) => ({ x, i })).filter((x) => x.x > 128);

      //   console.log(`hitIndexes`, hitIndexes.map((x) => `${x.i}:${x.x.toString(16)}`).join(`, `));
    },
  };
};
