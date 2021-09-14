import { ArtWork_p5, createRandomGenerator } from '@ricklove/art-common';

export const artwork: ArtWork_p5 = {
  key: `circles`,
  projectMetadata: {
    title: `Circles`,
    description: `The circles we travel in life always bring us back home.`,
    artist: `Rick Love`,
  },
  getTokenMetadata: (tokenId) => {
    return {
      tokenId,
    };
  },
  render: (tokenId) => {
    const { random } = createRandomGenerator(tokenId);

    const { a, b, c } = {
      a: 1 + Math.floor(57 * random()),
      b: 1 + Math.floor(213 * random()),
      c: 1 + Math.floor(115 * random()),
    };
    const { cr, cg, cb, ca } = {
      cr: Math.floor(25 + 230 * random()),
      cg: Math.floor(25 + 230 * random()),
      cb: Math.floor(25 + 230 * random()),
      ca: Math.floor(25 + 25 * random()),
    };

    return {
      draw: (p5, { time, canvasSize }) => {
        const h = 200;
        const scale = canvasSize.x / 600;

        p5.background(0);
        p5.scale(scale);

        for (let i = 0; i < 10; i++) {
          const color = p5.color((cr * i) % 255, (cg * i) % 255, (cb * i) % 255, ca);
          p5.noFill();
          p5.stroke(color);
          for (let j = 0; j < 36; j++) {
            p5.circle(h - a / 2 + (j % a), h - b / 2 + (j % b), h * 1.35 - ((i * 5) % c));
          }
          p5.translate(h, h);
          p5.rotate(a + b + c + (time / 60 + i) * 0.0005);
          p5.translate(-h, -h);
        }
      },
    };
  },
};
