/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from './rando';

/** Title: Layers of the Onion's Soul
 * Description: This represents the complexity of an onion's soul - which has many layers, like a human. 
 * Artist: Rick Love & Lydia Love who called me weirdo as inspiration, and mentioned a circle, some squares, a tetrahedron, Minecraft blocks, and then said she meant cubes and spheres.
*/
export const renderArt_circles = (hostElement: HTMLElement, hash = `This is my hash!`) => {
    // const { a, b, c } = { a: 57, b: 23, c: 15 };

    const { random } = createRandomGenerator(hash);
    const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(23 * random()), c: 1 + Math.floor(15 * random()) };

    new p5((s: p5) => {
        s.setup = () => {
            s.createCanvas(400, 400);
        };
        s.draw = () => {
            s.background(0);
            for (let i = 0; i < 10; i++) {
                const color = s.color(255, 255, 255, 20);
                s.noFill();
                s.stroke(color);
                for (let j = 0; j < 36; j++) {
                    s.circle(200 - a / 2 + j % a, 200 - b / 2 + j % b, 270 - (i * 5) % c);
                }
            }
        };
    }, hostElement);
};
