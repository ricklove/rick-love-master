import path from 'path';

export const joinPathNormalized = (...x: string[]) => path.join(...x).replace(/\\/g, `/`);
