/* eslint-disable new-cap */
/* eslint-disable no-new */
import type p5 from 'p5';
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';
import { createEventProvider, EventProvider } from '../games/event-provider';
import { createPixelArt } from './generate-pixel-art';
import { pixelFontBase64_pressStart } from '../nft-adventure/media/pixel-font-press-start';

export const art_pixelArtGenerator: ArtWork = {
    key: `pixel-art-generator`,
    title: `Pixel Art Generator - DEMO`,
    description: `Pixel Art Generator - DEMO`,
    artist: `Rick Love`,
    canSetSeed: false,
    getTokenDescription: (seed: string) => {
        return null;
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
        let eventProvider = null as null |EventProvider;

        const now = () => {
            return recorder ? recorder.timeProvider.now() : Date.now();
        };

        const gameState = { timeStartMs: now() };
        let font = null as null | p5.Font;

        // pixel art
        // const pixelArt_01 = null as null|GameImage;

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

                    // if (x.key.toLowerCase() === `backspace`){
                    //     gameState.input = gameState.input.substr(0, gameState.input.length - 1);
                    // } else if (x.key.toLowerCase() === `enter`){
                    //     gameState. input += `\n`;
                    // } else if (x.key.match(/^[A-Za-z0-9 ]$/)) {
                    //     gameState.input = gameState.input.trimStart() + x.key;
                    // }

                    // console.log(`keypress`, { x, input: gameState.input });
                });

                // pixelArt_01 = createPixelArt(s, { size: { width: 32, height: 32 } });

            };
            s.draw = () => {
                // WEBGL
                s.translate(-size / 2, -size / 2, 0);
                if (font) { s.textFont(font); }

                s.background(0);

                const timeStart = gameState.timeStartMs ?? now();
                const timeMs = now() - timeStart;

                // TESTING
                const pixelArt_01 = createPixelArt(s, { timeMs, size: { width: 32, height: 32 } });
                if (pixelArt_01){
                    const img = pixelArt_01.imageScales.find(x => x.scaleRatio === 8);
                    if (img){
                        s.tint(255, 255);
                        s.image(img.image, 0, 0, img.image.width, img.image.height);
                    }
                }

            };
        }, hostElement);
    },
};
