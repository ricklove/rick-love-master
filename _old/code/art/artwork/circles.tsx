/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../rando';
import { ArtWork } from '../artwork-type';

export const art_circles: ArtWork = {
    key: `circles`,
    title: `Circles`,
    description: `The circles we travel in life always bring us back home.`,
    artist: `Rick Love`,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    // openSea: {
    //     tokenAddress: `0x495f947276749ce646f68ac8c248420045cb7b5e`,
    //     tokenId: `91242641486941084018191434774360347389366801368112854311223385694785434025985`,
    // },
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`, recorder) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };


        const { random } = createRandomGenerator(hash);

        const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        const TARGET_SIZE = 600;
        const SMALL_SIZE = 300;
        const size = window.innerWidth > TARGET_SIZE && window.innerHeight > TARGET_SIZE ? TARGET_SIZE : SMALL_SIZE;

        const h = 200;
        const scale = size / 400;
        const speed = 0.5;

        let tick = 0;
        let canvas = null as null | HTMLCanvasElement;

        return new p5((s: p5) => {
            s.setup = () => {
                const result = s.createCanvas(size, size);
                const canvasId = `${Math.random()}`;
                result.id(canvasId);
                canvas = document.getElementById(canvasId) as HTMLCanvasElement;
            };
            s.draw = () => {
                if (recorder?.isWaitingForFrame() && canvas) {
                    console.log(`game.update waitingForFrame - addFrame`, {});
                    (async () => await recorder.getRecorder().addFrame(canvas))();
                    return;
                }

                s.background(0);
                s.scale(scale);

                for (let i = 0; i < 10; i++) {
                    const color = s.color((cr * i) % 255, (cg * i) % 255, (cb * i) % 255, ca);
                    s.noFill();
                    s.stroke(color);
                    for (let j = 0; j < 36; j++) {
                        s.circle(h - a / 2 + j % a, h - b / 2 + j % b, (h * 1.35) - (i * 5) % c);
                    }
                    s.translate(h, h);
                    // s.rotate((a + b + c + tick * 0.001) % 2);
                    s.rotate((a + b + c + tick * 0.001));
                    s.translate(-h, -h);
                    tick += speed;
                }

                tick++;
            };
        }, hostElement);
    },
};
