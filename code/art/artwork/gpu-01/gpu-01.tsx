/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { createRandomGenerator } from '../../rando';
import { ArtWork } from '../../artwork-type';

const path = `/content/art/artwork/gpu-01/gpu-01`;

export const art_gpu_01: ArtWork = {
    key: `art-gpu-01`,
    title: `Gpu Example 01`,
    description: `2015 - http://patriciogonzalezvivo.com

This is included as a great example of a gpu shader.
    
From: https://thebookofshaders.com/13/`,
    artist: `@patriciogv`,
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


        // const { a, b, c } = { a: 1 + Math.floor(57 * random()), b: 1 + Math.floor(213 * random()), c: 1 + Math.floor(115 * random()) };
        // const { cr, cg, cb, ca } = { cr: Math.floor(25 + 230 * random()), cg: Math.floor(25 + 230 * random()), cb: Math.floor(25 + 230 * random()), ca: Math.floor(25 + 25 * random()) };

        const size = 600;
        // const h = 200;
        // const scale = size / 400;
        // const speed = 0.5;

        // let tick = 0;

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
                shaderInstance.setUniform(`u_resolution`, [size, size]);
                shaderInstance.setUniform(`u_time`, s.millis() / 1000);
                shaderInstance.setUniform(`u_mouse`, [s.mouseX, s.map(s.mouseY, 0, size, size, 0)]);

                // shader() sets the active shader with our shader
                s.shader(shaderInstance);

                // rect gives us some geometry on the screen
                s.rect(0, 0, size, size);
            };
        }, hostElement);
    },
};
