import * as THREE from 'three';

export const createAudioBeatCalculator = () => {
  // TODO: disable if not used in real time
  const state = {
    audio: undefined as undefined | THREE.Audio,
    audioAnalyser: undefined as undefined | THREE.AudioAnalyser,
    buckets: [] as boolean[],
    bucketsAverages: [] as number[],
    //topBuckets: [] as number[],
    top: ``,
    total: 0,
    totalRunning: 0,
  };

  return {
    setup: (audio: THREE.Audio) => {
      state.audio = audio;
      const audioAnalyser = (state.audioAnalyser = new THREE.AudioAnalyser(audio, 1024));
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

      //   for (let i = 0; i < data.length; i++) {
      //     const value = data[i];

      //     state.bucketsAverages[i] = (state.bucketsAverages[i] || 0) * 0.95 + value * 0.05;
      //     const diff = Math.abs(state.bucketsAverages[i] - value);

      //     const isHit = diff > 64;
      //     const wasHit = state.buckets[i];
      //     state.buckets[i] = isHit;

      //     if (isHit !== wasHit) {
      //       console.log(`hit change ${isHit ? `OOO` : `...`} [${i}] @${value.toString(16)} ${diff.toString(16)}`);
      //     }
      //   }

      const total = data.reduce((a, b) => a + b, 0);
      const diffRatio = (total - state.totalRunning) / state.totalRunning;

      if (diffRatio > 0.5 && total > 100) {
        console.log(`total`, total, `diffRatio`, diffRatio, `totalRunning`, state.totalRunning);
        state.total = total;
        // spike
        // state.totalRunning = state.totalRunning * 0.5 + total * 0.5;
        state.totalRunning = total;
      } else {
        // bleed off
        state.totalRunning = state.totalRunning * 0.8 + total * 0.18;
      }

      //   const hitIndexes = [...data].map((x, i) => ({ x, i })).filter((x) => x.x > 128);

      //   console.log(`hitIndexes`, hitIndexes.map((x) => `${x.i}:${x.x.toString(16)}`).join(`, `));
    },
  };
};
