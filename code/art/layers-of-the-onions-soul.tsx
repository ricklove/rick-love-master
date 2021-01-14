/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from './rando';

/** Title: Layers of the Onion's Soul
 * Description: This represents the complexity of an onion's soul - which has many layers, like a human. 
 * Artist: Rick Love & Lydia Love who called me weirdo as inspiration, and mentioned a circle, some squares, a tetrahedron, Minecraft blocks, and then said she meant cubes and spheres.
*/
export const renderArt_layersOfTheOnionsSoul = (hostElement: HTMLElement, hash = `This is my hash!`) => {
    // const { a, b, c } = { a: 3, b: 7, c: 15 };

    const { random } = createRandomGenerator(hash);
    const { a, b, c, d, e } = { a: 1 + Math.floor(17 * random()), b: 1 + Math.floor(57 * random()), c: 1 + Math.floor(35 * random()), d: 0 + Math.floor(5 * random()), e: 20 + Math.floor(255 * random()) };
    // const { cr, cg, cb } = { cr: 207, cg: 175, cb: 65 };
    const { cr, cg, cb } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()) };


    new p5((s: p5) => {
        s.setup = () => {
            s.createCanvas(400, 400);
        };
        s.draw = () => {
            s.background(0);
            for (let i = 0; i < 35; i++) {
                const color = s.color(cr, cg * (1 + i * a) % 255, cb + i);
                s.fill(color);
                s.circle(150 + (i * 7) % b - a, 250 + i - c % 35 + b, (270 - i) % e);
                s.rotate(d);
            }
        };
    }, hostElement);
};
