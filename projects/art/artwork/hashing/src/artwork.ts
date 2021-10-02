import { ArtWork_p5, p5Types } from '@ricklove/art-common';
import { metadata } from './metadata';
import { glsl as glsl_vert } from './shaders/identity.vert';
import { glsl as glsl_frag } from './shaders/xor.frag';

export const artwork: ArtWork_p5 = {
  ...metadata,
  kind: `p5`,
  config: {
    webgl: true,
  },
  render: (_tokenId) => {
    // const { random } = createRandomGenerator(tokenId);

    // https://github.com/phusion/node-sha3/blob/main/src/sponge/index.js

    // Create kernel

    // const { a, b, c } = {
    //   a: 1 + Math.floor(57 * random()),
    //   b: 1 + Math.floor(213 * random()),
    //   c: 1 + Math.floor(115 * random()),
    // };
    // const { cr, cg, cb, ca } = {
    //   cr: Math.floor(25 + 230 * random()),
    //   cg: Math.floor(25 + 230 * random()),
    //   cb: Math.floor(25 + 230 * random()),
    //   ca: Math.floor(25 + 25 * random()),
    // };

    let mandel = null as null | p5Types.Shader;

    return {
      setup: (p5) => {
        mandel = p5.createShader(glsl_vert, glsl_frag);
        p5.shader(mandel);
        p5.noStroke();
        // 'p' is the center point of the Mandelbrot image
        mandel.setUniform(`p`, [-0.74364388703, 0.13182590421]);
      },
      draw: (p5, { time, canvasSize }) => {
        if (!mandel) {
          return;
        }

        // 'r' is the size of the image in Mandelbrot-space
        // mandel.setUniform(`r`, 1.5 * p5.exp(-6.5 * (1 + p5.sin(p5.millis() / 2000))));

        // Drawing surface
        p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
      },
    };
  },
};
