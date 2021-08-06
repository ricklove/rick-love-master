/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';

const path = `/content/art/artwork/flying-colors/flying-colors`;

export const art_flyingColors: ArtWork = {
    key: `flying-colors`,
    title: `Flying Colors`,
    description: `Mmmm, bright`,
    artist: `Rick Love`,
    getTokenDescription: (tokenId: string) => {
        return null;
    },
    // openSea: {
    //     tokenAddress: `0x495f947276749ce646f68ac8c248420045cb7b5e`,
    //     tokenId: `91242641486941084018191434774360347389366801368112854311223385694785434025985`,
    // },
    renderArt: (hostElement: HTMLElement, hash = `This is my hash!`) => {
        // const { a, b, c } = { a: 57, b: 23, c: 15 };

        const { random } = createRandomGenerator(hash);
        const seed = random();


        // const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        // const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        const size = 600;
        // const h = 200;
        // const scale = size / 400;
        // const speed = 0.5;

        // let tick = 0;
        let lastTimeMs = 0;
        const gameTimeMs = 0;
        const lastTimeModifier = 1;

        let shaderInstance: null | p5.Shader = null;

        return new p5((s: p5) => {
            s.preload = () => {
                shaderInstance = s.loadShader(`${path}.vert`, `${path}.frag`);
            };
            s.setup = () => {
                s.createCanvas(size, size, s.WEBGL);
                s.noStroke();
            };
            s.draw = () => {
                if (!shaderInstance) { return; }

                // send resolution of sketch into shader
                const deltaTimeMs = lastTimeMs - s.millis();
                lastTimeMs = s.millis();

                // const timeModifier = 0.7 * (0.5 + 0.7 * Math.cos(s.millis() / (5 * 1000)));
                // const timeModifier01 = lastTimeModifier + 0.25 * (0.5 - Math.random());
                // const timeModifier02 = Math.min(1, Math.max(0, timeModifier01));
                // const dampen = Math.pow(Math.abs(timeModifier02 - 0.5) * 2, 5);
                // const timeModifier = dampen * 0.5 + (1 - dampen) * timeModifier02;

                // const timeModifier01 = lastTimeModifier + 0.25 * (0.5 - Math.random());
                // const timeModifier02 = Math.min(1, Math.max(0, timeModifier01));

                // lastTimeModifier = timeModifier;
                // gameTimeMs += deltaTimeMs * timeModifier;


                // console.log(`draw`, { lastTimeModifier, seed, mouse: s.mouseX, gameTimeMs });

                shaderInstance.setUniform(`u_resolution`, [size, size]);
                shaderInstance.setUniform(`u_time`, lastTimeMs / 1000);
                shaderInstance.setUniform(`u_mouse`, [s.mouseX, s.map(s.mouseY, 0, size, size, 0)]);
                shaderInstance.setUniform(`u_seed`, seed);

                // shader() sets the active shader with our shader
                s.shader(shaderInstance);

                // rect gives us some geometry on the screen
                s.rect(0, 0, size, size);
            };
        }, hostElement);
    },
};
