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

    for (let j = 0; j < 1; j++) {

        // g.fill(color.h, color.s, color.b, 0.25);
        g.fill(0, 0, 0);
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
    }

    for (let j = 0; j < 4; j++) {

        g.noFill();
        // g.fill(0, 0, 0, 0.1);
        // g.fill(color.h, color.s, color.b, 0.05);
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
        g.fill(0, 0, 0);
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
        const { random: randomMain } = createRandomGenerator(hash);

        let tick = 0;

        const canvasSize = 300;
        const halfSize = canvasSize * 0.5;
        const minGearRadius = canvasSize / 16;
        const maxGearRadius = canvasSize / 3;
        const minGearCount = 8;
        const maxGearCount = 16;
        const gearCount = Math.floor(minGearCount + (maxGearCount - minGearCount) * randomMain());

        let lastGear = {
            position: { x: halfSize, y: halfSize },
            radius: minGearRadius,
            // position: { x: canvasSize * randomMain(), y: canvasSize * randomMain() },
            // size: minGearSize + (maxGearSize - minGearSize) * randomMain(),
            randomSeed: `${randomMain()}`,
            color: { h: 360 * randomMain(), s: 50, b: 50, a: 0.5 },
        };
        const gears = [...new Array(gearCount)].map(() => {

            const targetRadius = minGearRadius + (maxGearRadius - minGearRadius) * randomMain();
            const targetDistance = lastGear.radius + targetRadius;
            const lastPos = lastGear.position;

            // Try to bring back to center
            const targetAngle = Math.PI / 2 * randomMain() +
                (lastPos.x > halfSize && lastPos.y > halfSize ? Math.PI * 1
                    : lastPos.x < halfSize && lastPos.y > halfSize ? Math.PI * 0.5
                        : lastPos.x > halfSize && lastPos.y < halfSize ? Math.PI * 1.5
                            : 0);

            const pos = {
                x: lastPos.x + targetDistance * Math.cos(targetAngle),
                y: lastPos.y + targetDistance * Math.sin(targetAngle),
            };
            const xDelta = pos.x - lastPos.x;
            const yDelta = pos.y - lastPos.y;
            const actualRadius = Math.sqrt(xDelta * xDelta + yDelta * yDelta) - lastGear.radius;

            // eslint-disable-next-line no-return-assign
            return lastGear = {
                position: pos,
                radius: actualRadius,
                randomSeed: `${randomMain()}`,
                color: { h: 360 * randomMain(), s: 50, b: 50, a: 0.5 },
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
                        color: gear.color,
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
