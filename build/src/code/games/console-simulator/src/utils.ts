export { delay } from '../../../utils/src/delay';
export { randomIndex, randomItem } from '../../../utils/src/random';
export { getValuesAsItems } from '../../../utils/src/objects';
export { moveItem } from '../../../utils/src/arrays';
export const randomBinary = (length: number) => String.fromCharCode(...[...new Array(length)].map(x => Math.random() * (126 - 32) + 32));
