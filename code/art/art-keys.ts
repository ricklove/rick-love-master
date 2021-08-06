
// Note: this file needs to be importable with no dependencies to build the site index

export const artKeys = [
    `fluid-simulator-game`,
    `example-fluid-simulator`,
    `flying-colors`,
    `gpu-01`,
    `gears`,
    `puzzle-01`,
    `121`,
    `circles`,
    `onions`,
] as const;
export type ArtKey = typeof artKeys[number];
