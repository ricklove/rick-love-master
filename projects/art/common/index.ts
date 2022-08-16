export * from './src/artwork';
export * from './src/global-art-controller';
export * from './src/random';
export * from './src/vectors';
import type * as p5Types from 'p5';
export { p5Types };
// Support shader glsl``
export const glsl = (x: TemplateStringsArray) => `${x}`;
