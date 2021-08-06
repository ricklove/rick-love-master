
// Note: this file needs to be importable with no dependencies to build the site index

export const artIndex = [
    { key: `fluid-snake-game`, title: `Fluid Snake Game`, imageUrl: undefined },
    { key: `fluid-flappy-game`, title: `Fluid Flappy Game`, imageUrl: undefined },
    { key: `example-fluid-simulator`, title: `Example Fluid Simulator`, imageUrl: undefined },
    { key: `flying-colors`, title: `Flying Colors`, imageUrl: undefined },
    { key: `gpu-01`, title: `GPU-01`, imageUrl: undefined },
    { key: `gears`, title: `Gears`, imageUrl: undefined },
    { key: `puzzle-01`, title: `Puzzle 01`, imageUrl: undefined },
    { key: `121`, title: `121`, imageUrl: undefined },
    { key: `circles`, title: `Circles`, imageUrl: `./artwork/circles.png` },
    { key: `onions`, title: `Onions`, imageUrl: undefined },
] as const;
export type ArtKey = typeof artIndex[number]['key'];
