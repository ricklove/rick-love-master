import { ArtWork_p5, p5Types } from '@ricklove/art-common';
import { metadata } from './metadata';
import { glsl as glsl_fullVert } from './shaders/full.vert';
import { glsl as glsl_spongeFrag } from './shaders/sponge.frag';

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

    const SIZE = 256;
    let inputImage = null as null | p5Types.Image;
    let spongeGraphics = null as null | p5Types.Graphics;
    let spongeShader = null as null | p5Types.Shader;

    const state = {
      step: `load`,
    };

    return {
      setup: (p5, { canvasSize }) => {
        inputImage = p5.createImage(SIZE, SIZE);

        spongeGraphics = p5.createGraphics(SIZE, SIZE, `webgl`);
        spongeShader = p5.createShader(glsl_fullVert, glsl_spongeFrag);
        // spongeGraphics.shader(spongeShader);
        // spongeGraphics.noStroke();

        p5.shader(spongeShader);
        p5.noStroke();
      },
      draw: (p5, { time, canvasSize }) => {
        if (!spongeGraphics || !spongeShader || !inputImage) {
          return;
        }

        // spongeGraphics.shader(spongeShader);
        // spongeGraphics.noStroke();

        // Load data
        if (state.step === `load`) {
          const loadInputData = () => {
            if (!inputImage) {
              return;
            }
            inputImage.loadPixels();
            const pixels32 = inputImage.pixels;

            const w = inputImage.width;
            const h = inputImage.height;
            for (let x = 0; x < w; x++) {
              for (let y = 0; y < h; y++) {
                // prettier-ignore
                // pixels32[x + y * w] = 0
                //   + Math.floor(256 * Math.random()) << 24
                //   + Math.floor(256 * Math.random()) << 16
                //   + Math.floor(256 * Math.random()) << 8
                //   + 256
                // ;

                pixels32[x + y * w] = 0
                  + 256 << 24
                  + 256 << 16
                  + 256 << 8
                  + 256
                ;

                // pixels32[x + y * w] = 0
                //   + (x % 4 === 0 || y % 4 === 0 ? 256 : 0) << 24
                //   + (x % 4 === 0 || y % 4 === 0 ? 256 : 0) << 16
                //   + (x % 4 === 0 || y % 4 === 0 ? 256 : 0) << 8
                //   + 256
                // ;
              }
            }

            inputImage.updatePixels();
          };
          loadInputData();

          spongeShader.setUniform(`uInput`, inputImage);
          spongeShader.setUniform(`uResolution`, [SIZE, SIZE]);
          // spongeGraphics.scale(1 / SIZE, 1 / SIZE);
          // spongeGraphics.rect(-1, -1, 2, 2);

          // spongeCanvas.
          // sponge.setUniform(`u_time`, lastTimeMs / 1000);
          // sponge.setUniform(`u_mouse`, [s.mouseX, s.map(s.mouseY, 0, size, size, 0)]);
          // sponge.setUniform(`u_seed`, seed);

          // sponge.setUniform(`vTextureWidth`, SIZE);
          // sponge.setUniform(`vTextureHeight`, SIZE);
        }

        // 'r' is the size of the image in Mandelbrot-space
        // mandel.setUniform(`r`, 1.5 * p5.exp(-6.5 * (1 + p5.sin(p5.millis() / 2000))));

        // Drawing surface
        // p5.scale(1 / SIZE, 1 / SIZE);
        // p5.quad(-1, -1, 1, -1, 1, 1, -1, 1);
        // p5.translate(canvasSize.x, canvasSize.y);
        // p5.rect(0, 0, canvasSize.x, canvasSize.y);

        p5.scale(1 / SIZE, 1 / SIZE);
        // p5.image(spongeGraphics, -1, -1, 2, 2);
        p5.rect(-1, -1, 2, 2);
      },
    };
  },
};
