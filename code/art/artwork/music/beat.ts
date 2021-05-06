import { randomItem, randomOrder } from 'utils/random';
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

    const finalMixNode = !audioContext.createDynamicsCompressor ? audioContext.destination
        : (() => {
            const compressor = audioContext.createDynamicsCompressor();
            compressor.connect(audioContext.destination);
            return compressor;
        })();

    const mainFilterNode = audioContext.createBiquadFilter();
    mainFilterNode.Q.value = 1;
    mainFilterNode.type = `lowpass`;
    mainFilterNode.frequency.value = 0.5 * audioContext.sampleRate;
    mainFilterNode.connect(finalMixNode);

    // Create master volume.
    const mainGainNode = audioContext.createGain();
    mainGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
    mainGainNode.connect(mainFilterNode);

    const mixNode = mainGainNode;

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
        gainNode.connect(mixNode);

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

    const song1A = createSong(`
    A2 A2 A2 .
    A2 A2 A2 A4
    `);

    // const song1 = createSong(`A2 A2 A2 A4 . B2 C3 A4`);
    const song1 = createSong(`
    C2 D2 E2 G2
    D2 E2 G2 A2
    E2 G2 A2 C3
    `);

    const song2 = createSong(`
    C2 E2 D2 G2
    E2 A2 G2 C3
    A2 D3 C3 E3

    D3 G3 E3 A3 
    G3 C4 A3 D4 
    C4 .  .  .
    `);

    // const song3Dis = createSong(`
    // F#2 G#3 D#3 A#2
    // F#2 G#3 D#3 .
    // `);

    const song3 = createSong(`
    C4 A3 G3 E3
    A3 G3 E3 .
    G3 E3 D3 C3
    E3 D3 C3 .
    D3 C3 A2 G2
    C3 A2 G2 .
    A2 G2 E2 D2
    G2 E2 D2 .
    `);

    // const song2 = createSong(`
    //  . B2 C3 D3
    // F2 C3 D3 A3
    // C3 .  E3 D3
    // A2 E2 G2 A3
    // `);

    // const song3 = createSong(`
    //  . B2 C3  .
    // F2 C3 D3 A4
    // C3 .  E3 D4
    // A2 E2 G4 A4
    // `);

    // const song4 = createSong(`
    //  . C3 A3 A3
    // F3 G3 A3 .
    // F3 A3 F3 B3
    // G3 A3 B3 .
    // G3 C4 B3 A3
    // `);

    // const song5 = createSong(`
    //  . A2 .  F1
    // E2 E1 D1 .
    //  . F2 E1 A2
    // B2 A2 F1 .
    // `);

    // const song = createSong(`C3 A3 B3 C3 . A3 C3 A3 A3 F3 G3 A3 . F3 A3 F3 B3 G3 A3 B3 . G3 B3 A3 G3 G3 G3 G3`);
    // const song = createSong(`A3 C3 A3 A3 F3 G3 A3 . F3 A3 F3 B3 G3 A3 B3 . G3 C4 B3 A3 .`);
    // const song = createSong(`aabcd aabcd aabcd ffe`);

    const createRandomSong = () => {

        if (Math.random() < 0.25){
            const mainNotes = `CDEGACDEGA.`.split(``);
            const mainOctave = randomItem([2, 3]);

            const sSongSource = [...new Array(4 * (2 + Math.floor(4 * Math.random())))]
                .map(() => `${randomItem(mainNotes)}${mainOctave} `)
                .join(``);
            const sSong = createSong(sSongSource.substr(1) + `C${mainOctave + 1}`);
            return sSong;
        }

        //const sSong = randomItem([song1A, song1, song2, song3]);
        const sSong = randomItem([song1A, song1, song3]);
        // const sSong = randomItem([song1, song2, song3, song4, song5]);
        // return sSong;
        // return [...new Array(2 + 4 * Math.floor(4 * Math.random()))]
        //     .map((_, i) => (i % 4 === 3) ? sSong[0] : randomItem(sSong));
        // return randomOrder(sSong);

        // if (Math.random() < 0.25){
        //     return randomOrder(sSong);
        // }

        return sSong;
    };

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
        console.log(`updateWaveform`, { iVoice, positions });

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

        const wave = audio.audioContext.createPeriodicWave(real, imag, { disableNormalization: true });
        audio.voices[iVoice].oscNode.setPeriodicWave(wave);
    };

    const scheduleNote = (iVoice: number, iBeat: number, timeOffset: number, timeForNote: number) => {
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
        const timeToDelaySec = 0.01 * timeForNote;
        const timeToStartSec = 0.1 * timeForNote;
        const timeToStopSec = 0.1 * timeForNote;
        const timeToPlaySec = timeForNote;
        const timeStart = audioTime + timeToDelaySec;
        const timePlay = timeStart + timeToStartSec;
        const timePlayEnd = timePlay + timeToPlaySec;
        const timeStop = timePlayEnd + timeToStopSec;

        audio.voices[iVoice].gainNode.gain.setValueAtTime(0, timeStart);
        audio.voices[iVoice].gainNode.gain.linearRampToValueAtTime(1, timePlay);
        audio.voices[iVoice].gainNode.gain.setValueAtTime(1, timePlayEnd);
        audio.voices[iVoice].gainNode.gain.linearRampToValueAtTime(0, timeStop);

        // audio.voices[iVoice].gainNode.gain.setValueAtTime(1, audioTime);
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
            const voiceLength = state.audio.voices.length;
            for (let v = 0; v < voiceLength; v++){
                if (v >= state.positions.length){ continue;}

                if (!state.songs[v]
                    || (data.beatIndex % state.songs[v].length === 0
                    && Math.random() < 0.15)){
                    state.songs[v] = createRandomSong();
                    state.iBeat = 0;
                }

                // state.audio.voices[v].oscNode.type = `custom`;
                const positions = state.positions.filter((x, i) => i % voiceLength === v);
                updateWaveform(v, positions);

                for (let i = 0; i < chunkSize; i++){
                    const timeForNote = state.timePerBeat
                        / Math.min(1 + state.positions.length, state.audio.voices.length);
                    scheduleNote(v,
                        (state.iBeat + i) % state.songs[v].length,
                        i * state.timePerBeat + v * timeForNote,
                        timeForNote);

                    // const timeForNote = 0.25 * state.timePerBeat;
                    // scheduleNote(v,
                    //     (state.iBeat + i) % state.songs[v].length,
                    //     i * state.timePerBeat,
                    //     timeForNote);
                }
            }

            // console.log(`beat`, { iBeat: state.iBeat });
        },
    };
};
