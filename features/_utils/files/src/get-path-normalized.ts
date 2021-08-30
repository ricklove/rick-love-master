import path from 'path';

export const getPathNormalized = (...x: string[]) => path.resolve(path.join(...x)).replace(/\\/g, `/`);
