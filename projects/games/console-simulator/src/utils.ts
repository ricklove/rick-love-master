export { delay, getValuesAsItems, randomIndex, randomItem, moveItem } from '@ricklove/utils-core';
export const randomBinary = (length: number) =>
  String.fromCharCode(...[...new Array(length)].map((_x) => Math.random() * (126 - 32) + 32));
