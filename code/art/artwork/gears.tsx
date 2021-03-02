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
    const { random: randomConstant } = createRandomGenerator(`${randomSeed}`);
    const { random } = createRandomGenerator(`${randomSeed}${Math.round(rotationAngle * angleRandomKs)}`);
    const randomSym = () => 1 - 2 * random();

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
    let jitterSize = 2.5;
    const angle0 = rotationAngle;
    const angle1 = angle0 + Math.PI * 2 * randomConstant();

    jitterSize = radiusOuter * 0.1;
    for (let j = 0; j < 4; j++) {

        g.noStroke();
        g.fill(color.h, color.s, color.b * 0.25, 0.4);
        // g.fill(color.h, color.s, color.b, 0.25);
        // g.fill(0, 0, 0);
        g.curveTightness(0.9);
        g.beginShape();
        for (let i = 0; i <= teeth; i++) {
            // g.curveVertex(x + diaI * g.cos((i + 0) * toothAngle), y + diaI * g.sin((i + 0) * toothAngle));
            if (i !== 0) {
                g.curveVertex(x + radI * g.cos((i + 0.2) * toothAngle + angle0) + jitterSize * randomSym(), y + radI * g.sin((i + 0.2) * toothAngle + angle0) + jitterSize * randomSym());
            }

            g.curveVertex(x + radO * g.cos((i + 0.3) * toothAngle + angle0) + jitterSize * randomSym(), y + radO * g.sin((i + 0.3) * toothAngle + angle0) + jitterSize * randomSym());
            g.curveVertex(x + radO * g.cos((i + 0.7) * toothAngle + angle0) + jitterSize * randomSym(), y + radO * g.sin((i + 0.7) * toothAngle + angle0) + jitterSize * randomSym());
            g.curveVertex(x + radI * g.cos((i + 0.8) * toothAngle + angle0) + jitterSize * randomSym(), y + radI * g.sin((i + 0.8) * toothAngle + angle0) + jitterSize * randomSym());
            // g.curveVertex(x + diaI * g.cos((i + 1) * toothAngle), y + diaI * g.sin((i + 1) * toothAngle));
            // g.arc(x, y, diaI, diaI, (i + 0) * toothAngle, (i + 0.5) * toothAngle);
            // g.arc(x, y, diaO, diaO, (i + 0.5) * toothAngle, (i + 1) * toothAngle);
        }
        g.endShape();
    }

    jitterSize = 2.5;
    g.noFill();
    g.stroke(color.h, color.s, color.b, color.a);

    // Draw face
    const drawFace = randomConstant() > 0.5;
    const faceType = random() > 0.5 ? `happy` : `creepy`;
    if (drawFace) {
        const radSmile = 0.5 * radI;
        for (let j = 0; j < 4; j++) {

            // Smile
            if (faceType === `creepy`) {
                jitterSize = 12;
            }
            g.noFill();
            g.curveTightness(0.9);
            g.beginShape();
            for (let i = 0; i <= teeth / 3; i++) {
                g.curveVertex(x + radSmile * g.cos((i + 0.2) * toothAngle + angle1) + jitterSize * randomSym(), y + radSmile * g.sin((i + 0.2) * toothAngle + angle1) + jitterSize * randomSym());
            }
            g.endShape();

            // jitterSize = 2.5;

            // Left Eye
            for (let e = 0; e <= 1; e++) {
                const r = e === 0 ? 1.1 : 1.6;
                const ex = radSmile * Math.cos(r * Math.PI + angle1);
                const ey = radSmile * Math.sin(r * Math.PI + angle1);
                g.fill(0, 0, 0);
                g.beginShape();
                for (let i = 0; i <= teeth + 2; i++) {
                    g.curveVertex(ex + x + radiusAxis * g.cos((i + 0.3) * toothAngle + angle1) + jitterSize * randomSym(), ey + y + radiusAxis * g.sin((i + 0.3) * toothAngle + angle1) + jitterSize * randomSym());
                }
                g.endShape();
            }
        }
    }

    jitterSize = 2.5;
    for (let j = 0; j < 4; j++) {

        g.noFill();
        // g.fill(0, 0, 0, 0.1);
        // g.fill(color.h, color.s, color.b, 0.05);
        g.curveTightness(0.9);
        g.beginShape();
        for (let i = 0; i <= teeth; i++) {
            // g.curveVertex(x + diaI * g.cos((i + 0) * toothAngle), y + diaI * g.sin((i + 0) * toothAngle));
            if (i !== 0) {
                g.curveVertex(x + radI * g.cos((i + 0.2) * toothAngle + angle0) + jitterSize * randomSym(), y + radI * g.sin((i + 0.2) * toothAngle + angle0) + jitterSize * randomSym());
            }

            g.curveVertex(x + radO * g.cos((i + 0.3) * toothAngle + angle0) + jitterSize * randomSym(), y + radO * g.sin((i + 0.3) * toothAngle + angle0) + jitterSize * randomSym());
            g.curveVertex(x + radO * g.cos((i + 0.7) * toothAngle + angle0) + jitterSize * randomSym(), y + radO * g.sin((i + 0.7) * toothAngle + angle0) + jitterSize * randomSym());
            g.curveVertex(x + radI * g.cos((i + 0.8) * toothAngle + angle0) + jitterSize * randomSym(), y + radI * g.sin((i + 0.8) * toothAngle + angle0) + jitterSize * randomSym());
            // g.curveVertex(x + diaI * g.cos((i + 1) * toothAngle), y + diaI * g.sin((i + 1) * toothAngle));
            // g.arc(x, y, diaI, diaI, (i + 0) * toothAngle, (i + 0.5) * toothAngle);
            // g.arc(x, y, diaO, diaO, (i + 0.5) * toothAngle, (i + 1) * toothAngle);
        }
        g.endShape();

        // Inner circle
        g.fill(0, 0, 0);
        g.beginShape();
        for (let i = 0; i <= teeth + 2; i++) {
            g.curveVertex(x + radiusAxis * g.cos((i + 0.3) * toothAngle + angle0) + jitterSize * randomSym(), y + radiusAxis * g.sin((i + 0.3) * toothAngle + angle0) + jitterSize * randomSym());
        }
        g.endShape();
    }

};

export const art_gears = {
    key: `art-gears`,
    title: `Gears`,
    description: `Are the gears of conflict twisting our perceptions of others?`,
    artist: `Rick Love`,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`) => {
        const { random: randomMain } = createRandomGenerator(hash);

        let tick = 0;
        // const speed = 1 / (200 - 100 * randomMain());
        const speed = 1 / (100 - 70 * randomMain());
        // const sat = 65 - 10 * Math.random();
        const sat = 100;
        const brightness = 60 - 20 * Math.random();

        const canvasSize = 600;
        const halfSize = canvasSize * 0.5;
        const minGearRadius = canvasSize / 16;
        const maxGearRadius = canvasSize / 3;
        const minGearCount = 3;
        const maxGearCount = 8;
        const gearCount = Math.floor(minGearCount + (maxGearCount - minGearCount) * randomMain());

        let lastGear = {
            position: { x: canvasSize * randomMain(), y: canvasSize * randomMain() },
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
            const angleQuandrant = (lastPos.x > halfSize && lastPos.y > halfSize) ? (Math.PI * 1)
                : (lastPos.x < halfSize && lastPos.y > halfSize) ? (Math.PI * 1.5)
                    : (lastPos.x > halfSize && lastPos.y < halfSize) ? (Math.PI * 0.5)
                        : 0;
            // console.log(`angleQuandrant`, { angleQuandrant, lastPos, halfSize });
            const targetAngle = Math.PI / 2 * randomMain() + angleQuandrant;

            const posRaw = {
                x: lastPos.x + targetDistance * Math.cos(targetAngle),
                y: lastPos.y + targetDistance * Math.sin(targetAngle),
            };
            const pos = posRaw;
            // const pos = {
            //     x: 0.8 * posRaw.x + 0.2 * halfSize,
            //     y: 0.8 * posRaw.y + 0.2 * halfSize,
            // };

            const xDelta = pos.x - lastPos.x;
            const yDelta = pos.y - lastPos.y;
            const actualRadius = Math.sqrt(xDelta * xDelta + yDelta * yDelta) - lastGear.radius;

            // eslint-disable-next-line no-return-assign
            return lastGear = {
                position: pos,
                radius: actualRadius,
                randomSeed: `${randomMain()}`,
                color: { h: 360 * randomMain(), s: sat, b: brightness, a: 0.5 },
            };
        });


        return new p5((s: p5) => {
            s.setup = () => {
                s.createCanvas(canvasSize, canvasSize);
            };
            s.draw = () => {
                s.background(0);
                // s.background(10, 10, 10);
                const g = s;
                // const g = s.createGraphics(canvasSize * 2, canvasSize * 2);
                // g.translate(canvasSize, canvasSize);
                // g.scale(0.25);

                for (const [i, gear] of gears.entries()) {
                    const direction = i % 2 === 0 ? 1 : -1;
                    const teethDepth = 5;
                    const teeth = Math.ceil(gear.radius * Math.PI * 2 / (4 * teethDepth));
                    const teethPassed = tick * speed * Math.pow(1.25, i + 1);
                    const rotationAngle = s.TWO_PI * teethPassed / teeth;

                    drawGear(g, {
                        position: gear.position,
                        // radiusInner: gear.size * 0.93,
                        // radiusOuter: gear.size * 1.07,
                        radiusInner: gear.radius - teethDepth,
                        radiusOuter: gear.radius + teethDepth,
                        // radiusAxis: gear.radius * 0.15,
                        radiusAxis: gear.radius * 0.1,
                        // radiusAxis: teethDepth,
                        teeth,
                        color: gear.color,
                        rotationAngle: direction * rotationAngle,
                        randomSeed: gear.randomSeed,
                    });

                    // Rotate slightly
                    g.translate(gear.position.x, gear.position.y);
                    g.rotate(s.TWO_PI * teethPassed / (teeth * 4));
                    g.translate(-gear.position.x, -gear.position.y);
                }
                // s.image(g, 0, 0, canvasSize, canvasSize);


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
