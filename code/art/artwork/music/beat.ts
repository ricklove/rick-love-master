import { Vector2 } from '../games/utils';

const createAudio = () => {
    const audioContext = (() => {
        try {
            const AudioContext = (window.AudioContext || (window as unknown as { webkitAudioContext: AudioContext }).webkitAudioContext) ;
            return new AudioContext();
        } catch {
            console.error(`The Web Audio API is apparently not supported in this browser.`);
            return null;
        }
    })();
    if(!audioContext){ return null; }

    const oscNode = audioContext.createOscillator();
    oscNode.connect( audioContext.destination );
    oscNode.frequency.value = 0;
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
    // compressor.connect(	audioContext.destination );
    // // onUpdateVolume( {currentTarget:{value:currentVol}} );

    // // if (!isMobile) {
	// //   	const irRRequest = new XMLHttpRequest();
	// // 	irRRequest.open(`GET`, `sounds/irRoom.wav`, true);
	// // 	irRRequest.responseType = `arraybuffer`;
	// // 	irRRequest.addEventListener(`load`, function() {
	// //   		audioContext.decodeAudioData( irRRequest.response, 
	// //   			function(buffer) { if (revNode) revNode.buffer = buffer; else console.log(`no revNode ready!`);} );
	// // 	});
	// // 	irRRequest.send();
	// // }

    // }

    return {
        audioContext,
        oscNode,
    };

};

export const createBeatPlayer = () => {

    const state = {
        audio: null as null | ReturnType<typeof createAudio>,
        isStarted: false,
        isPlaying: false,
        iBeat: 0,
        positions: [] as Vector2[],
        shape: null as null | PeriodicWave,
    };

    const getNote = (note: string)=>{
        // C0	16.35
        // C#0/Db0 	17.32
        // D0	18.35
        // D#0/Eb0 	19.45
        // E0	20.60
        // F0	21.83
        // F#0/Gb0 	23.12
        // G0	24.50
        // G#0/Ab0 	25.96
        // A0	27.50
        // A#0/Bb0 	29.14
        // B0	30.87
        // C1	32.70
        // C#1/Db1 	34.65
        // D1	36.71
        // D#1/Eb1 	38.89
        // E1	41.20
        // F1	43.65
        // F#1/Gb1 	46.25
        // G1	49.00
        // G#1/Ab1 	51.91
        // A1	55.00
        // A#1/Bb1 	58.27
        // B1	61.74
        // C2	65.41
        // C#2/Db2 	69.30
        // D2	73.42
        // D#2/Eb2 	77.78
        // E2	82.41
        // F2	87.31
        // F#2/Gb2 	92.50
        // G2	98.00
        // G#2/Ab2 	103.83
        // A2	110.00
        // A#2/Bb2 	116.54
        // B2	123.47
        // C3	130.81
        // C#3/Db3 	138.59
        // D3	146.83
        // D#3/Eb3 	155.56
        // E3	164.81
        // F3	174.61
        // F#3/Gb3 	185.00
        // G3	196.00
        // G#3/Ab3 	207.65
        // A3	220.00
        // A#3/Bb3 	233.08
        // B3	246.94
        // C4	261.63
        // C#4/Db4 	277.18
        // D4	293.66
        // D#4/Eb4 	311.13
        // E4	329.63
        // F4	349.23
        // F#4/Gb4 	369.99
        // G4	392.00
        // G#4/Ab4 	415.30
        // A4	440.00
        // A#4/Bb4 	466.16
        // B4	493.88
        // C5	523.25
        // C#5/Db5 	554.37
        // D5	587.33
        // D#5/Eb5 	622.25
        // E5	659.25
        // F5	698.46
        // F#5/Gb5 	739.99
        // G5	783.99
        // G#5/Ab5 	830.61
        // A5	880.00
        // A#5/Bb5 	932.33
        // B5	987.77
        // C6	1046.50
        // C#6/Db6 	1108.73
        // D6	1174.66
        // D#6/Eb6 	1244.51
        // E6	1318.51
        // F6	1396.91
        // F#6/Gb6 	1479.98
        // G6	1567.98
        // G#6/Ab6 	1661.22
        // A6	1760.00
        // A#6/Bb6 	1864.66
        // B6	1975.53
        // C7	2093.00
        // C#7/Db7 	2217.46
        // D7	2349.32
        // D#7/Eb7 	2489.02
        // E7	2637.02
        // F7	2793.83
        // F#7/Gb7 	2959.96
        // G7	3135.96
        // G#7/Ab7 	3322.44
        // A7	3520.00
        // A#7/Bb7 	3729.31
        // B7	3951.07
        // C8	4186.01
        // C#8/Db8 	4434.92
        // D8	4698.63
        // D#8/Eb8 	4978.03
        // E8	5274.04
        // F8	5587.65
        // F#8/Gb8 	5919.91
        // G8	6271.93
        // G#8/Ab8 	6644.88
        // A8	7040.00
        // A#8/Bb8 	7458.62
        // B8	7902.13
    
        switch(note){
            case `A2`: case `a`: return 110;
            // case `A2#`: case `b`: return 116.54;
            case `B2`: case `b`: return 123.47;
            case `C2`: case `c`: return 130.81;
            case `D2`: case `d`: return 146.83;
            case `E2`: case `e`: return 164.81;
            case `F2`: case `f`: return 174.61;
            case `G2`: case `g`: return 196;
            case `A3`: return 220;
            case `A4`: return 440;
            default:  return 0;
        }
    };


    const createSong = (notes:string) => notes.split(` `).map(x=>getNote(x));

    // const song = createSong(`a a a a a A4 a a a a a A4 a a a a a A4 a a a`);
    // const song = createSong(`a a a A4 . b c A4`);
    // const song = createSong(`a a a A4 . b c A4 b c d A4 c d e A4`);
    const song = createSong(`C3 A3 B3 C3 . A3 C3 A3 A3 f g A3 . f A3 f B3 g A3 B3 . g B3 A3 g g g g`);
    // const song = createSong(`aabcd aabcd aabcd ffe`);

    const updateFrequency = ()=>{
        const {audio} = state;
        if(!audio){ return; }
        if( state.positions.length === 0 ){ return; }
       
        // state.iBeat++;
        // if( state.iBeat >= state.positions.length ){
        //     state.iBeat = 0;
        // }
        // const p = state.positions[state.iBeat];
        // if(!p){ return; }

        // if( !state.isPlaying ){
        //     result.oscNode.frequency.value = 0;
        //     return;
        // }

        // result.oscNode.frequency.value = 220;
        // result.oscNode.frequency.value = 220 + 220 * Math.pow(2, 2 * state.positions[0].x);
        // result.oscNode.detune.value = 500 - 1000 * state.positions[0].y;
        
        // result.oscNode.frequency.value = 80 * (1+1 * Math.pow(2, 2 * p.x));
        // result.oscNode.detune.value = 500 - 1000 * p.y;

        const real = new Float32Array(2 + state.positions.length);
        const imag = new Float32Array(2 + state.positions.length);
        real[0] = 0;
        imag[0] = 0;
        real[state.positions.length-1] = 0;
        imag[state.positions.length-1] = 0;

        for(const [i,p] of state.positions.entries()){
            real[i+1] = p.x;
            imag[i+1] = p.y;
        }

        const wave = audio.audioContext.createPeriodicWave(real,imag);
        audio.oscNode.setPeriodicWave(wave);

        // Play song
        if( state.iBeat >= song.length ){
            state.iBeat = 0;
        }
        audio.oscNode.frequency.value = song[state.iBeat] ?? 0;
    };

    return {
        /** This must be done after user UI */
        start: ()=>{
            if( state.isStarted ) { return; }
            state.isStarted = true;

            state.audio = createAudio();
            state.audio?.oscNode.start(0);

            // setInterval(()=>{
              
            // }, 1);
        },
        beat: (data:{ positions:Vector2[] }) => {
            if(!state.audio){ return; }
            if(!state.isStarted ) { return; }

            state.isPlaying = true;

            state.positions = data.positions;
            state.iBeat++;
            updateFrequency();

            // result.oscNode.start(0);
            // result.oscNode.frequency.value = 220 + 220 * Math.pow(2, 2 * data.positions[0].x);
            // const timeToPlay = 50;

            const timeToPlay = 1000 * 10/110;
            // const timeToPlay = 50 + 50 * data.positions[0].y;
            // result.oscNode.detune.value = 500 - 1000 * data.position.y;
            setTimeout(()=>{
                if(!state.audio){ return; }

                state.audio.oscNode.frequency.value = 0;
                state.isPlaying = false;
                // result.oscNode.stop();
            },timeToPlay);
        },
    };
};
