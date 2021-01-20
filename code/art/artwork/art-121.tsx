/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../rando';

export const art_121 = {
    title: `1/21/21 21:21:21`,
    description: `This exact time pattern will occur only once in our human timeline. This NFT crypto art will attempt to capture that time to the precise millisecond and embed it in the distributed blockchain forever. 
    
However the exact outcome cannot be controlled: 

The color scheme is generated from the hash of the address that mints the crypto-art.

Even more difficult to predict - the block mining timestamp since 1/21/21 21:21:21 UTC controls the behavior of the clocks:

Year
Month
Day
Hour
Minute
Second

If this is mined at the exact second, perfect stability will be achieved.

This is all up to whatever timing occurs on the blockchain when these NFTs are mined by the collectors.

Can we obtain the exact precision?
`,
    artist: `Rick Love`,
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };

        const { random } = createRandomGenerator(hash);
        const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        let tick = 0;

        return new p5((s: p5) => {
            s.setup = () => {
                s.createCanvas(350, 350);
            };
            s.draw = () => {
                s.background(0);

                const drawClock = (index: number, clockRadius: number, units: number, value: number) => {

                    const perUnit = 1 / units;
                    const d = 0.8 * clockRadius * Math.sin(Math.PI * 2 * perUnit);

                    for (let iHalf = 0; iHalf <= 1; iHalf++) {
                        const isFront = iHalf === 1;
                        let xZeroValue = 0;
                        for (let i = 0; i < units; i++) {


                            const errorRatio = (0.5 - Math.abs((value * perUnit) - 0.5)) * 2;
                            const correctRatioRaw = 1 - errorRatio;
                            // const correctRatio = correctRatioRaw * ((tick * 0.121 * correctRatioRaw) % 2 - 1);
                            const zRotation = Math.cos((tick * 0.0121 * correctRatioRaw + index * 0.25));
                            const angleOffset = -0.25 + value * perUnit;

                            const x = zRotation * clockRadius * Math.cos(Math.PI * 2 * (angleOffset - i * perUnit));
                            const y = clockRadius * Math.sin(Math.PI * 2 * (angleOffset - i * perUnit));

                            if (i === 0) {
                                xZeroValue = x;
                            }

                            const isFrontValue = (value === 0 && index % 2 === 0 ? -1 : 1) * Math.sign(xZeroValue) === Math.sign(x);
                            // const isFrontValue = Math.sign(xZeroValue) === Math.sign(x);
                            // const isFrontValue = Math.sign(xZeroValue) === Math.sign(x);

                            if (isFront && !isFrontValue) { continue; }
                            if (!isFront && isFrontValue) { continue; }

                            // if (isFront && isFrontX) { continue; }
                            // if (!isFront && (isFrontOnLeft && x > 0 || !isFrontOnLeft && x < 0)) { continue; }
                            // if (!isFront && value !== 0) { continue; }

                            const colorKey = index + 1;

                            // const alphaShift = 0.5 + 0.5 * (x / clockRadius) * (isFrontOnLeft ? -1 : 1);
                            // const alphaShift = 1;
                            const alphaShift = isFront ? 1 : 0.25;
                            const lowAlpha = Math.ceil(units < 100 ? 100 : 25);

                            s.noFill();
                            s.stroke(s.color((cr * colorKey) % 255, (cg * colorKey) % 255, (cb * colorKey) % 255, Math.ceil((value === 0 ? 255 : lowAlpha) * alphaShift)));
                            s.strokeWeight(2);
                            s.line(x * (1 - 0.05 * Math.abs(zRotation)), y * 0.95, x, y);

                            if (i === 0) {
                                s.stroke(s.color((cr * colorKey) % 255, (cg * colorKey) % 255, (cb * colorKey) % 255, value === 0 ? 255 : 50));
                                s.line(0, 0, x, y);
                            }
                        }
                    }

                };

                s.translate(175, 175);

                const delta = ((new Date(`2021-01-21 21:21:21.212Z`)).getTime() - Date.now());
                // const delta = ((new Date(`2022-01-21 21:21:21.212Z`)).getTime() - Date.now());
                // const delta = ((new Date(`2000-01-01 00:00:00.000Z`)).getTime() - Date.now());
                // const delta = 0;

                const e = {
                    year: Math.floor(delta / (1000 * 60 * 60 * 24 * 365)),
                    month: Math.floor(delta / (1000 * 60 * 60 * 24 * 31) % 12),
                    day: Math.floor(delta / (1000 * 60 * 60 * 24) % 31),
                    hour: Math.floor(delta / (1000 * 60 * 60) % 24),
                    minute: Math.floor(delta / (1000 * 60) % 60),
                    second: Math.floor(delta / (1000) % 60),
                    // ms: delta % 1000,
                };
                const isBefore = true;

                // tick = 0;
                for (let iTick = 0; iTick < 10; iTick++) {
                    drawClock(0, 140, 100, e.year);
                    drawClock(1, 120, 12, e.month);
                    drawClock(2, 100, 31, e.day);
                    drawClock(3, 80, 60, e.hour);
                    drawClock(4, 60, 60, e.minute);
                    drawClock(5, 40, 60, e.second);
                    // drawClock(6, 20, 1000, e.ms);

                    s.background(s.color(0, 0, 0, 5));
                    tick++;
                }

                s.translate(-175, -175);


                const drawText = () => {
                    s.textSize(20);
                    s.noStroke();
                    s.textFont(`monospace`);

                    const pad = (value: number, digits: number) => (`${value}`).padStart(digits, `0`);

                    s.fill(s.color(255, 255, 255));
                    s.text(`1/21/21 21:21:21 GST`, 60, 20);

                    s.fill(!isBefore ? s.color(0, 255, 0) : s.color(255, 0, 0));
                    s.text(`${isBefore ? `-` : `+`} ${pad(e.year, 2)}y ${pad(e.month, 2)}m ${pad(e.day, 2)}d ${pad(e.hour, 2)}:${pad(e.minute, 2)}:${pad(e.second, 2)}`, 50, 340);
                };

                drawText();

                tick++;
            };
        }, hostElement);
    },
};
