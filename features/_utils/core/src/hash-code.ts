/* eslint-disable no-bitwise */

// From: https://stackoverflow.com/a/52171480
/** Generate an integer hashCode */
const cyrb53 = (str: string, seed = 0): number => {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  // 53-bit int
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);

  // Generate a 64-bit hashcode as a string
  // return (h2 >>> 0).toString(16).padStart(8, `0`) + (h1 >>> 0).toString(16).padStart(8, `0`);
};

export const hashCode = cyrb53;
