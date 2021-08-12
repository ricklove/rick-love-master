/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';
import { createNftAdventure_nftTextAdventure } from './stories/nft-text-adventure';
import { drawGameStepAction } from './game-engine';

const nftAdventure_nftDungeon = createNftAdventure_nftTextAdventure();

export const art_nftAdventure_nftDungeon: ArtWork = {
    key: `nft-adventure-nft-dungeon`,
    title: nftAdventure_nftDungeon.metadata.name,
    description: nftAdventure_nftDungeon.metadata.description,
    artist: nftAdventure_nftDungeon.metadata.author,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    // openSea: {
    //     tokenAddress: `0x495f947276749ce646f68ac8c248420045cb7b5e`,
    //     tokenId: `91242641486941084018191434774360347389366801368112854311223385694785434025985`,
    // },
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`, recorder) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };


        // const { random } = createRandomGenerator(hash);

        // const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        // const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        const TARGET_SIZE = 300;
        const SMALL_SIZE = 300;
        const size = window.innerWidth > TARGET_SIZE && window.innerHeight > TARGET_SIZE ? TARGET_SIZE : SMALL_SIZE;

        const h = 200;
        const scale = size / 400;
        const speed = 0.5;

        let canvas = null as null | HTMLCanvasElement;
        let timeStart = Date.now();
        let wasRecording = false;
        let isDone = false;

        const [stepIndex, actionIndex] = hash.split(`:`).map(x => parseInt(x, 10));

        return new p5((s: p5) => {
            s.setup = () => {
                const result = s.createCanvas(size, size);
                const canvasId = `${Math.random()}`;
                result.id(canvasId);
                canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            };
            s.draw = () => {
                if (recorder?.isRecording() && !wasRecording){
                    timeStart = recorder.timeProvider.now();
                    isDone = false;
                }
                wasRecording = recorder?.isRecording() ?? false;

                if (isDone){ return; }

                // if (recorder?.isWaitingForFrame() && canvas) {
                //     console.log(`game.update waitingForFrame - addFrame`, {});
                //     (async () => await recorder.getRecorder().addFrame(canvas))();
                //     return;
                // }

                const timeMs = recorder ? (recorder.timeProvider.now() - timeStart)
                    : (Date.now() - timeStart);
                const result = drawGameStepAction({
                    frame: { width: size, height: size },
                    s,
                    gameData: nftAdventure_nftDungeon,
                    step: nftAdventure_nftDungeon.story[stepIndex],
                    actionIndex,
                    timeMs,
                });

                if (result.done){
                    isDone = true;
                }

                if (recorder?.isWaitingForFrame() && canvas){
                    console.log(`game.update waitingForFrame - addFrame`, {});
                    (async () => await recorder.getRecorder().addFrame(canvas))();
                }

            };
        }, hostElement);
    },
};
