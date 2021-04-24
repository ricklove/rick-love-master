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
        // A2    110.00
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

        // A2   110.00
        // B2	123.47
        // C3	130.81
        // D3	146.83
        // E3	164.81
        // F3	174.61
        // G3	196.00
    
        switch(note){
            case `A2`: case `a`: return 110;
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
    const song = createSong(`a a a A4 . b c A4 b c d A4 c d e A4`);
    // const song = createSong(`aabcd aabcd aabcd ffe`);

    const updateFrequency = ()=>{
        const {audio} = state;
        if(!audio){ return; }
        if( state.positions.length === 0 ){ return; }

        if( state.iBeat >= song.length ){
            state.iBeat = 0;
        }
        audio.oscNode.frequency.value = song[state.iBeat] ?? 0;

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
