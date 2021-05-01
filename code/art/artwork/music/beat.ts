import { randomItem } from 'utils/random';
import { Vector2 } from '../games/utils';
import { musicNotes, NoteName } from './music-notes';

const createAudio = (voiceCount: number) => {
    const audioContext = (() => {
        try {
            const AudioContext = (window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext);
            return new AudioContext();
        } catch {
            console.error(`The Web Audio API is apparently not supported in this browser.`);
            return null;
        }
    })();
    if (!audioContext){ return null; }

    const createVoice = () => {
        const oscNode = audioContext.createOscillator();
        oscNode.frequency.value = 0;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0;

        const filterNode = audioContext.createBiquadFilter();
        filterNode.Q.value = 1;
        filterNode.type = `bandpass`;

        // Connect nodes
        const enableFilter = true;
        if (enableFilter){
            oscNode.connect(filterNode);
            filterNode.connect(gainNode);
        } else {
            oscNode.connect(gainNode);
        }
        gainNode.connect(audioContext.destination);

        return {
            oscNode,
            filterNode,
            gainNode,
        };
    };


    // oscNode.type = `custom`;

    // const periodicWave = audioContext.createPeriodicWave()

    // oscNode.type = `triangle`;
    // oscNode.type = `sine`;

    // const isMobile = (navigator.userAgent.includes(`Android`))||(navigator.userAgent.includes(`iPad`))||(navigator.userAgent.includes(`iPhone`));

    // // set up the master effects chain for all voices to connect to.
    // // const effectChain = audioContext.createGain();
    // // const waveshaper = new WaveShaper( audioContext );
    // // effectChain.connect( waveshaper.input );
    // // onUpdateDrive( currentDrive );

    // const revNode =  !isMobile ? audioContext.createConvolver() : audioContext.createGain();
    // const revGain = audioContext.createGain();
    // const revBypassGain = audioContext.createGain();
    // const volNode = audioContext.createGain();
    // volNode.gain.value = 75;
    // const compressor = audioContext.createDynamicsCompressor();
    // // waveshaper.output.connect( revNode );
    // // waveshaper.output.connect( revBypassGain );
    // revNode.connect( revGain );
    // revGain.connect( volNode );
    // revBypassGain.connect( volNode );
    // // onUpdateReverb( {currentTarget:{value:currentRev}} );

    // volNode.connect( compressor );
    // compressor.connect(    audioContext.destination );
    // // onUpdateVolume( {currentTarget:{value:currentVol}} );

    // // if (!isMobile) {
    // //       const irRRequest = new XMLHttpRequest();
    // //     irRRequest.open(`GET`, `sounds/irRoom.wav`, true);
    // //     irRRequest.responseType = `arraybuffer`;
    // //     irRRequest.addEventListener(`load`, function() {
    // //           audioContext.decodeAudioData(irRRequest.response,
    // //               function(buffer) { if (revNode) revNode.buffer = buffer; else console.log(`no revNode ready!`);});
    // //     });
    // //     irRRequest.send();
    // // }

    // }

    return {
        audioContext,
        voices: [... new Array(voiceCount)].map(() => createVoice()),
    };

};

export const createBeatPlayer = () => {
    const getNote = (note: string) => {
        if (!musicNotes.has(note as NoteName)){ return 0;}
        return musicNotes.get(note as NoteName);
    };
    const createSong = (notes: string) => notes.replace(/\s/g, ` `).split(` `).filter(x => x).map(x => getNote(x));

    // const song = createSong(`a a a a a A4 a a a a a A4 a a a a a A4 a a a`);
    // const song = createSong(`a a a A4 . b c A4`);
    const song1 = createSong(`
     . B2 C3 A3  
    B2 C3 D3 A3  
    C3 D3 E3 A3  
    A2 A2 A2 A3`);

    const song2 = createSong(`
     . B2 C3 D3  
    F2 C3 D3 A3  
    C3 .  E3 D3  
    A2 E2 G2 A3`);

    // const song = createSong(`C3 A3 B3 C3 . A3 C3 A3 A3 F3 G3 A3 . F3 A3 F3 B3 G3 A3 B3 . G3 B3 A3 G3 G3 G3 G3`);
    // const song = createSong(`A3 C3 A3 A3 F3 G3 A3 . F3 A3 F3 B3 G3 A3 B3 . G3 C4 B3 A3 .`);
    // const song = createSong(`aabcd aabcd aabcd ffe`);

    const createRandomSong = () => [...new Array(2 + 4 * Math.floor(4 * Math.random()))].map(() => randomItem(song2));

    const state = {
        audio: null as null | ReturnType<typeof createAudio>,
        isStarted: false,
        iBeat: 0,
        timePerBeat: 0.25,
        timeLastBeat: 0,
        positions: [] as Vector2[],
        shape: null as null | PeriodicWave,
        songs: [createRandomSong()],
    };

    const updateWaveform = (iVoice: number, positions: Vector2[]) => {
        const { audio } = state;
        if (!audio){ return; }
        if (positions.length === 0){ return; }

        const real = new Float32Array(2 + positions.length);
        const imag = new Float32Array(2 + positions.length);
        real[0] = 0;
        imag[0] = 0;
        real[positions.length - 1] = 1;
        imag[positions.length - 1] = 0;

        for (const [i, p] of positions.entries()){
            real[i + 1] = p.x;
            imag[i + 1] = p.y;
        }

        // const waveTable = waveTable_piano;
        // const n = waveTable.real.length;
        // const real = new Float32Array(n);
        // const imag = new Float32Array(n);
        // for (let i = 0; i < n; ++i) {
        //     real[i] = waveTable.real[i];
        //     imag[i] = waveTable.imag[i];
        // }

        const wave = audio.audioContext.createPeriodicWave(real, imag, { disableNormalization: true });
        audio.voices[iVoice].oscNode.setPeriodicWave(wave);
    };

    const scheduleNote = (iVoice: number, iBeat: number, timeOffset: number) => {
        const { audio } = state;
        if (!audio){ return; }
        if (state.positions.length === 0){ return; }

        // Play song
        const audioTime = audio.audioContext.currentTime + timeOffset;

        const freq = state.songs[iVoice][iBeat] ?? 0;
        audio.voices[iVoice].oscNode.frequency.setValueAtTime(freq, audioTime);
        audio.voices[iVoice].filterNode.frequency.setValueAtTime(freq, audioTime);
        // audio.filterNode.frequency.setValueAtTime(800 + freq * 0.1, audioTime);
        if (!freq){ return;}

        // Note length
        // const timeToDelaySec = 0.05 * 10 / 110;
        // const timeToStartSec = 0.1 * 10 / 110;
        // const timeToStopSec = 0.1 * 10 / 110;
        // const timeToPlaySec = 1 * 10 / 110;
        // const timeStart = audioTime + timeToDelaySec;
        // const timePlay = timeStart + timeToStartSec;
        // const timePlayEnd = timePlay + timeToPlaySec;
        // const timeStop = timePlayEnd + timeToStopSec;

        // audio.voices[iVoice].gainNode.gain.setValueAtTime(0, timeStart);
        // audio.voices[iVoice].gainNode.gain.linearRampToValueAtTime(1, timePlay);
        // audio.voices[iVoice].gainNode.gain.setValueAtTime(1, timePlayEnd);
        // audio.voices[iVoice].gainNode.gain.linearRampToValueAtTime(0, timeStop);

        audio.voices[iVoice].gainNode.gain.setValueAtTime(1, audioTime);
    };

    return {
        /** This must be done after user UI */
        start: () => {
            if (state.isStarted) { return; }
            state.isStarted = true;

            state.audio = createAudio(2);
            state.audio?.voices.forEach(v => v.oscNode.start(0));
        },
        beat: (data: { beatIndex: number, positions: Vector2[] }) => {
            if (!state.audio){ return; }
            if (!state.isStarted) { return; }

            state.timePerBeat = state.audio.audioContext.currentTime - state.timeLastBeat;
            state.timeLastBeat = state.audio.audioContext.currentTime;

            const chunkSize = 4;
            if (data.beatIndex % chunkSize !== 0){ return;}
            state.iBeat += chunkSize;


            state.positions = data.positions;
            for (let v = 0; v < state.audio.voices.length; v++){
                if (v > state.positions.length){ continue;}

                if (!state.songs[v]
                    || (data.beatIndex % state.songs[v].length === 0
                    && Math.random() < 0.35)){
                    state.songs[v] = createRandomSong();
                    state.iBeat = 0;
                }

                // const positions = state.positions.filter((x, i) => i % v === 0);
                // updateWaveform(v, positions);

                for (let i = 0; i < chunkSize; i++){
                    scheduleNote(v, (state.iBeat + i) % state.songs[v].length, i * state.timePerBeat + v * state.audio.voices.length / state.timePerBeat);
                }
            }

            // console.log(`beat`, { iBeat: state.iBeat });
        },
    };
};
