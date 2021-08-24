import path from 'path';
import { delay } from '@ricklove/utils-core';
import { placeholder } from '@ricklove/example-lib-lib';

export const exampleValue10 = {
  example3: `Here it is nice! ${placeholder}`,
  example4: `OK!`,

  run2: async () => {
    const a = Date.now();
    await delay(100);
    const filePath = path.resolve(`./index.ts`);

    const b = Date.now();

    const c = `${a}-${b}: ${b - a}ms`;

    return { a, b, c, ok: true, filePath };
  },
};
