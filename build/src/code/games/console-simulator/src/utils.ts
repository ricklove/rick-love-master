export { delay } from '../../../../code/utils/src/delay';
export { randomIndex, randomItem } from '../../../../code/utils/src/random';
export { getValuesAsItems } from '../../../../code/utils/src/objects';
export { moveItem } from '../../../../code/utils/src/arrays';
export const randomBinary = (length: number) => String.fromCharCode(...[...new Array(length)].map(x => Math.random() * (126 - 32) + 32));
