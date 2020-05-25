export { delay } from 'utils/delay';
export { randomIndex, randomItem, } from 'utils/random';
export { getValuesAsItems } from 'utils/objects';
export { moveItem } from 'utils/arrays';
export const randomBinary = (length: number) => String.fromCharCode(...[...new Array(length)].map(x => Math.random() * (126 - 32) + 32));
