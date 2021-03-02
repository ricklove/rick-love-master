/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../rando';

type Vector2 = { x: number, y: number };
type ColorHsb = {
    /** 0-360 */
    h: number;
    /** 0-100 */
    s: number;
    /** 0-100 */
    b: number;
    /** 0-1 */
    a: number;
};
const drawGear = (g: p5,
    options: {
        position: Vector2;
        radiusInner: number;
        radiusOuter: number;
        radiusAxis: number;
        teeth: number;
        rotationAngle: number;
        color: ColorHsb;
        randomSeed: string;
    }) => {
    g.colorMode(`hsl`);

    const { position: { x, y }, radiusInner, radiusOuter, radiusAxis, teeth, rotationAngle, color, randomSeed } = options;

    const angleRandomKs = 16;
    // const angleRandomKs = 8;
    const { random } = createRandomGenerator(`${randomSeed}${Math.round(rotationAngle * angleRandomKs)}`);

    // g.fill(color.h, color.s, color.b, color.a);
    // g.stroke(0, 0, 0, 1);
    // g.stroke(0, 0, 0, color.a);
    // g.stroke(0, 0, 0, 0);
    // g.circle(x, y, radiusOuter * 2);
    // g.circle(x, y, radius * 2);

    g.stroke(color.h, color.s, color.b, color.a);
    g.noFill();

    // g.circle(x, y, radiusOuter * 2);

    const toothAngle = g.TWO_PI / teeth;
    const radI = radiusInner;
    const radO = radiusOuter;
    const jitterSize = 5;
    const angle0 = rotationAngle;

    for (let j = 0; j < 4; j++) {
        g.curveTightness(0.9);
        g.beginShape();
        for (let i = 0; i <= teeth; i++) {
            // g.curveVertex(x + diaI * g.cos((i + 0) * toothAngle), y + diaI * g.sin((i + 0) * toothAngle));
            if (i !== 0) {
                g.curveVertex(x + radI * g.cos((i + 0.2) * toothAngle + angle0) + jitterSize * random(), y + radI * g.sin((i + 0.2) * toothAngle + angle0) + jitterSize * random());
            }

            g.curveVertex(x + radO * g.cos((i + 0.3) * toothAngle + angle0) + jitterSize * random(), y + radO * g.sin((i + 0.3) * toothAngle + angle0) + jitterSize * random());
            g.curveVertex(x + radO * g.cos((i + 0.7) * toothAngle + angle0) + jitterSize * random(), y + radO * g.sin((i + 0.7) * toothAngle + angle0) + jitterSize * random());
            g.curveVertex(x + radI * g.cos((i + 0.8) * toothAngle + angle0) + jitterSize * random(), y + radI * g.sin((i + 0.8) * toothAngle + angle0) + jitterSize * random());
            // g.curveVertex(x + diaI * g.cos((i + 1) * toothAngle), y + diaI * g.sin((i + 1) * toothAngle));
            // g.arc(x, y, diaI, diaI, (i + 0) * toothAngle, (i + 0.5) * toothAngle);
            // g.arc(x, y, diaO, diaO, (i + 0.5) * toothAngle, (i + 1) * toothAngle);
        }
        g.endShape();

        // Inner circle
        g.beginShape();
        for (let i = 0; i <= teeth + 2; i++) {
            g.curveVertex(x + radiusAxis * g.cos((i + 0.3) * toothAngle + angle0) + jitterSize * random(), y + radiusAxis * g.sin((i + 0.3) * toothAngle + angle0) + jitterSize * random());
        }
        g.endShape();
    }

};

export const art_gears = {
    key: `art-gears`,
    title: `Gears`,
    description: `The gears mesh together to form our lives.`,
    artist: `Rick Love`,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };

        const { random: randomMain } = createRandomGenerator(hash);
        // const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        // const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        let tick = 0;

        const canvasSize = 300;
        const minGearRadius = canvasSize / 16;
        const maxGearRadius = canvasSize / 2;
        const maxGearCount = 16;
        const gearCount = Math.floor(1 + maxGearCount * randomMain());

        let lastGear = {
            position: { x: canvasSize * 0.5, y: canvasSize * 0.5 },
            radius: minGearRadius,
            // position: { x: canvasSize * randomMain(), y: canvasSize * randomMain() },
            // size: minGearSize + (maxGearSize - minGearSize) * randomMain(),
            randomSeed: `${randomMain()}`,
        };
        const gears = [...new Array(gearCount)].map(() => {

            const targetRadius = minGearRadius + (maxGearRadius - minGearRadius) * randomMain();
            const targetDistance = lastGear.radius + targetRadius;
            const targetAngle = Math.PI / 2 * Math.random() +
                (lastGear.position.x > canvasSize * 0.5 && lastGear.position.y > canvasSize * 0.5 ? Math.PI * 1
                    : lastGear.position.x < canvasSize * 0.5 && lastGear.position.y > canvasSize * 0.5 ? Math.PI * 0.5
                        : lastGear.position.x > canvasSize * 0.5 && lastGear.position.y < canvasSize * 0.5 ? Math.PI * 1.5
                            : 0);

            const pos = {
                x: lastGear.position.x + targetDistance * Math.cos(targetAngle),
                y: lastGear.position.y + targetDistance * Math.sin(targetAngle),
            };
            const xDelta = pos.x - lastGear.position.x;
            const yDelta = pos.y - lastGear.position.y;
            const actualRadius = Math.sqrt(xDelta * xDelta + yDelta * yDelta) - lastGear.radius;

            // eslint-disable-next-line no-return-assign
            return lastGear = {
                position: pos,
                radius: actualRadius,
                randomSeed: `${randomMain()}`,
            };
        });


        return new p5((s: p5) => {
            s.setup = () => {
                s.createCanvas(canvasSize, canvasSize);
            };
            s.draw = () => {
                s.background(0);

                for (const [i, gear] of gears.entries()) {
                    const direction = i % 2 === 0 ? 1 : -1;
                    const teethDepth = 5;
                    const teeth = Math.ceil(gear.radius * Math.PI * 2 / (4 * teethDepth));
                    const teethPassed = tick / 100;
                    const rotationAngle = s.TWO_PI * teethPassed / teeth;

                    drawGear(s, {
                        position: gear.position,
                        // radiusInner: gear.size * 0.93,
                        // radiusOuter: gear.size * 1.07,
                        radiusInner: gear.radius - teethDepth,
                        radiusOuter: gear.radius + teethDepth,
                        radiusAxis: gear.radius * 0.15,
                        teeth,
                        color: { h: 15 * i, s: 50, b: 50, a: 0.5 },
                        rotationAngle: direction * rotationAngle,
                        randomSeed: gear.randomSeed,
                    });
                }
                // for (let i = 0; i < 10; i++) {
                //     const color = s.color((cr * i) % 255, (cg * i) % 255, (cb * i) % 255, ca);
                //     s.noFill();
                //     s.stroke(color);
                //     for (let j = 0; j < 36; j++) {
                //         s.circle(200 - a / 2 + j % a, 200 - b / 2 + j % b, 270 - (i * 5) % c);
                //     }
                //     s.translate(200, 200);
                //     // s.rotate((a + b + c + tick * 0.001) % 2);
                //     s.rotate((a + b + c + tick * 0.001));
                //     s.translate(-200, -200);
                //     tick++;
                // }

                tick++;
            };
        }, hostElement);
    },
};
