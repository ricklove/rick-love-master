import { ArtWork_p5, p5Types } from '@ricklove/art-common';
import { metadata } from './metadata';

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

    // the 'varying's are shared between both vertex & fragment shaders
    const varying = `precision highp float; varying vec2 vPos;`;

    // the vertex shader is called for each vertex
    const vs = varying + `attribute vec3 aPosition;` + `void main() { vPos = (gl_Position = vec4(aPosition,1.0)).xy; }`;

    // the fragment shader is called for each pixel
    const fs =
      varying +
      `uniform vec2 p;` +
      `uniform float r;` +
      `const int I = 500;` +
      `void main() {` +
      `  vec2 c = p + vPos * r, z = c;` +
      `  float n = 0.0;` +
      `  for (int i = I; i > 0; i --) {` +
      `    if(z.x*z.x+z.y*z.y > 4.0) {` +
      `      n = float(i)/float(I);` +
      `      break;` +
      `    }` +
      `    z = vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y) + c;` +
      `  }` +
      `  gl_FragColor = vec4(0.5-cos(n*17.0)/2.0,0.5-cos(n*13.0)/2.0,0.5-cos(n*23.0)/2.0,1.0);` +
      `}`;

    let mandel = null as null | p5Types.Shader;

    return {
      setup: (p5) => {
        mandel = p5.createShader(vs, fs);
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
        mandel.setUniform(`r`, 1.5 * p5.exp(-6.5 * (1 + p5.sin(p5.millis() / 2000))));
        p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
      },
    };
  },
};
