/* eslint-disable new-cap */
/* eslint-disable no-new */
import type p5 from 'p5';
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';
import { createNftAdventure_nftTextAdventure } from './stories/nft-text-adventure';
import { drawGame, GameCache, GameState } from './game-engine';
import { createEventProvider, EventProvider } from '../games/event-provider';
import { pixelFontBase64_pressStart } from './media/pixel-font-press-start';

const nftAdventure_nftDungeon = createNftAdventure_nftTextAdventure();

export const art_nftAdventure_nftTextAdventure: ArtWork = {
    key: `nft-text-adventure`,
    title: nftAdventure_nftDungeon.metadata.name,
    description: nftAdventure_nftDungeon.metadata.description,
    artist: nftAdventure_nftDungeon.metadata.author,
    canSetSeed: false,
    getTokenDescription: (seed: string) => {
        const [stepIndex, actionIndex] = seed.split(`:`).map(x => parseInt(x, 10));

        const step = nftAdventure_nftDungeon.story[stepIndex];
        const action = step?.actions[actionIndex];

        if (!action){
            return `${stepIndex} - ${step?.title ?? ``}`;
        }

        return `${stepIndex}:${actionIndex} - ${step?.title ?? ``} > ${action?.name ?? ``}`;
    },
    // openSea: {
    //     tokenAddress: `0x495f947276749ce646f68ac8c248420045cb7b5e`,
    //     tokenId: `91242641486941084018191434774360347389366801368112854311223385694785434025985`,
    // },
    renderArt: (hostElement: HTMLElement, seed = `This is my hash!`, recorder, createP5) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };


        const { random } = createRandomGenerator(seed);

        // const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        // const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        const TARGET_SIZE = 300;
        const SMALL_SIZE = 300;
        const size = window.innerWidth > TARGET_SIZE && window.innerHeight > TARGET_SIZE ? TARGET_SIZE : SMALL_SIZE;

        const h = 200;
        const scale = size / 400;
        const speed = 0.5;

        let canvas = null as null | HTMLCanvasElement;
        let wasRecording = false;
        let isDone = false;

        let eventProvider = null as null |EventProvider;
        const [stepIndexInit, actionIndexInit] = seed.split(`:`).map(x => parseInt(x, 10) as undefined | number);

        const now = () => {
            return recorder ? recorder.timeProvider.now() : Date.now();
        };

        let gameState = {
            timeStart: now(),
            stepIndex: stepIndexInit,
            actionIndex: actionIndexInit,
            input: ``,
            isRespondingToInput: false,
            mode: `step`,
        } as GameState;

        const gameCache = {} as GameCache;
        let font = null as null | p5.Font;

        return createP5((s: p5) => {
            s.setup = () => {
                console.log(`renderArt:createP5:s.setup`);

                const result = s.createCanvas(size, size, `webgl`);
                font = s.loadFont(pixelFontBase64_pressStart);

                const canvasId = `${Math.random()}`;
                result.id(canvasId);
                canvas = document.getElementById(canvasId) as HTMLCanvasElement;

                eventProvider = createEventProvider(canvas);
                eventProvider.windowAddEventListener(`keydown`, x => {

                    if (x.key.toLowerCase() === `backspace`){
                        gameState.input = gameState.input.substr(0, gameState.input.length - 1);
                    } else if (x.key.toLowerCase() === `enter`){
                        gameState. input += `\n`;
                    } else if (x.key.match(/^[A-Za-z0-9 ]$/)) {
                        gameState.input = gameState.input.trimStart() + x.key;
                    }

                    console.log(`keypress`, { x, input: gameState.input });
                });

            };
            s.draw = () => {
                // console.log(`renderArt:createP5:s.draw`);

                // WEBGL
                s.translate(-size / 2, -size / 2, 0);
                if (font) { s.textFont(font); }

                if (recorder?.isRecording() && !wasRecording){
                    gameState.timeStartMs = recorder.timeProvider.now();
                    isDone = false;
                }
                wasRecording = recorder?.isRecording() ?? false;

                // if (isDone){ return; }

                // if (recorder?.isWaitingForFrame() && canvas) {
                //     console.log(`game.update waitingForFrame - addFrame`, {});
                //     (async () => await recorder.getRecorder().addFrame(canvas))();
                //     return;
                // }

                const timeStart = gameState.timeStartMs ?? now();
                const timeMs = now() - timeStart;

                const result = drawGame({
                    frame: { width: size, height: size },
                    s,
                    gameData: nftAdventure_nftDungeon,
                    gameState,
                    gameCache,
                    seed: seed,
                    timeMs,
                });

                gameState = result.gameState;
                if (!gameState.timeStartMs){
                    gameState.timeStartMs = now();
                }

                if (result.done){
                    isDone = true;
                    return;
                }

                if (recorder?.isWaitingForFrame() && canvas){
                    console.log(`game.update waitingForFrame - addFrame`, {});
                    (async () => await recorder.getRecorder().addFrame(canvas))();
                }

            };
        }, hostElement);
    },
};
