/* eslint-disable no-return-assign */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-bitwise */

// FROM: https://stackoverflow.com/a/47593316/567524

function xmur3(str: string) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }

    return () => {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

function mulberry32(a: number) {
    return () => {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export const createRandomGenerator = (hash: string) => {
    const seed = xmur3(hash)();
    return { random: mulberry32(seed) };
};
