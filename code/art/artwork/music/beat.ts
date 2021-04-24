import { Vector2 } from '../games/utils';

const createAudio = () => {
    const audioContext = (() => {
        try {
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
    // oscNode.type = `triangle`;
    oscNode.type = `sine`;

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

    const result = createAudio();

    if( result){
        const dest = document.body;
        (dest as any).audioNode = result.audioContext.destination;
    }

    const state = {
        isStarted: false,
    };

    return {
        /** This must be done after user UI */
        start: ()=>{
            if( state.isStarted ) { return; }
            state.isStarted = true;
            result?.oscNode.start(0);
        },
        beat: (data:{position:Vector2}) => {
            if(!result){ return; }
            if(!state.isStarted ) { return; }

            // result.oscNode.start(0);
            result.oscNode.frequency.value = 220 + 220 * Math.pow(2, 2 * data.position.x);
            const timeToPlay = 25 + 25 * data.position.y;
            // result.oscNode.detune.value = 500 - 1000 * data.position.y;
            setTimeout(()=>{
                result.oscNode.frequency.value = 0;
                // result.oscNode.stop();
            },timeToPlay);
        },
    };
};
