/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';
import { runFluidSimulator } from './src/run';

export const art_exampleFluidSimulator: ArtWork = {
    key: `art-exampleFluidSimulator`,
    title: `Fluid Simulator`,
    description: `2017 

This is included as an amazing gpu shader.
    
From: https://paveldogreat.github.io/WebGL-Fluid-Simulation/`,
    artist: `Pavel Dobryakov`,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    // openSea: {
    //     tokenAddress: `0x495f947276749ce646f68ac8c248420045cb7b5e`,
    //     tokenId: `91242641486941084018191434774360347389366801368112854311223385694785434025985`,
    // },
    renderArt: (hostElement: HTMLDivElement, hash) => {
        const result = runFluidSimulator(hostElement, { width: `600px`, height: `600px` });
        return {
            remove: () => result?.close(),
        };
    },
};
