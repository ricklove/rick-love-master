import path from 'path';
import { placeholder } from '@ricklove/example-lib-lib';
import { delay } from '@ricklove/utils-core';

export const exampleValue10 = {
  example3: `Here it is nice! ${placeholder} - fixed those imports`,
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
