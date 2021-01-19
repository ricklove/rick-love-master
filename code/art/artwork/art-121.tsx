/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../rando';

export const art_121 = {
    title: `121`,
    description: `1/21/21 21:21:21.212`,
    artist: `Rick Love`,
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };

        const { random } = createRandomGenerator(hash);
        const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        return new p5((s: p5) => {
            s.setup = () => {
                s.createCanvas(400, 400);
            };
            s.draw = () => {
                s.background(0);

                const drawClock = (index: number, clockRadius: number, units: number, error: number) => {

                    const perUnit = 1 / units;
                    const d = 0.8 * clockRadius * Math.sin(Math.PI * 2 * perUnit);
                    const angleOffset = -0.25 + error * perUnit;

                    for (let i = 0; i < units; i++) {
                        const x = clockRadius * Math.cos(Math.PI * 2 * (angleOffset - i * perUnit));
                        const y = clockRadius * Math.sin(Math.PI * 2 * (angleOffset - i * perUnit));

                        const colorKey = index + 1;
                        const alpha = error === 0 ? 255 : 50;
                        const color = s.color((cr * colorKey) % 255, (cg * colorKey) % 255, (cb * colorKey) % 255, alpha);

                        s.noFill();
                        s.stroke(color);
                        s.strokeWeight(2);
                        s.line(x * 0.95, y * 0.95, x, y);

                        if (i === 0) {
                            s.line(0, 0, x, y);
                        }
                    }

                };

                s.translate(200, 200);

                const now = (new Date(`2021-01-21 21:21:21.212Z`)).getTime() - Date.now();
                const e = {
                    year: Math.floor(now / (1000 * 60 * 60 * 24 * 365)),
                    month: Math.floor(now / (1000 * 60 * 60 * 24 * 31) % 12),
                    day: Math.floor(now / (1000 * 60 * 60 * 24) % 31),
                    hour: Math.floor(now / (1000 * 60 * 60) % 24),
                    minute: Math.floor(now / (1000 * 60) % 60),
                    second: Math.floor(now / (1000) % 60),
                    ms: now % 1000,
                };
                const isBefore = true;

                drawClock(0, 140, 100, e.year);
                drawClock(1, 120, 12, e.month);
                drawClock(2, 100, 31, e.day);
                drawClock(3, 80, 60, e.hour);
                drawClock(4, 60, 60, e.minute);
                drawClock(5, 40, 60, e.second);
                drawClock(6, 20, 1000, e.ms);

                s.translate(-200, -200);


                const drawText = () => {
                    s.textSize(20);
                    s.noStroke();
                    s.textFont(`monospace`);

                    const pad = (value: number, digits: number) => (`${value}`).padStart(digits, `0`);

                    s.fill(s.color(255, 255, 255));
                    s.text(`1/21/21 21:21:21.212 GST`, 70, 30);

                    s.fill(!isBefore ? s.color(0, 255, 0) : s.color(255, 0, 0));
                    s.text(`${isBefore ? `-` : `+`} ${pad(e.year, 2)}y ${pad(e.month, 2)}m ${pad(e.day, 2)}d ${pad(e.hour, 2)}:${pad(e.minute, 2)}:${pad(e.second, 2)}.${pad(e.ms, 3)}`, 50, 380);
                };

                // drawText();
            };
        }, hostElement);
    },
};
