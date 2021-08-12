
// Note: this file needs to be importable with no dependencies to build the site index
export const artIndex = [
    { key: `fluid-snake-game`, title: `Fluid Snake Game`, imageUrl: undefined, load: async () => (await import (`./artwork/example-PavelDoGreat-fluid-simulation/fluid-snake`)).art_fluidSnakeGame },
    // { key: `fluid-flappy-game`, title: `Fluid Flappy Game`, imageUrl: undefined, load: async () => await import (`./artwork/example-PavelDoGreat-fluid-simulation/fluid-flappy`) },
    { key: `example-fluid-simulator`, title: `Example Fluid Simulator`, imageUrl: undefined, load: async () => (await import (`./artwork/example-PavelDoGreat-fluid-simulation/example-fluid-simulator`)).art_exampleFluidSimulator },
    { key: `flying-colors`, title: `Flying Colors`, imageUrl: undefined, load: async () => (await import (`./artwork/flying-colors/flying-colors`)).art_flyingColors },
    { key: `gpu-01`, title: `GPU-01`, imageUrl: undefined, load: async () => (await import (`./artwork/gpu-01/gpu-01`)).art_gpu_01 },
    { key: `gears`, title: `Gears`, imageUrl: undefined, load: async () => (await import (`./artwork/gears`)).art_gears },
    { key: `puzzle-01`, title: `Puzzle 01`, imageUrl: undefined, load: async () => (await import (`./artwork/puzzle/art-puzzle-01`)).art_puzzle01 },
    { key: `121`, title: `121`, imageUrl: undefined, load: async () => (await import (`./artwork/art-121`)).art_121 },
    { key: `circles`, title: `Circles`, imageUrl: `./artwork/circles.png`, load: async () => (await import (`./artwork/circles`)).art_circles },
    { key: `onions`, title: `Onions`, imageUrl: undefined, load: async () => (await import (`./artwork/layers-of-the-onions-soul`)).art_layersOfTheOnionsSoul },
    { key: `nft-text-adventure`, title: `Nft Text Adventure`, imageUrl: `./artwork/nft-adventure/stories/nft-text-adventure.png`, load: async () => (await import (`./artwork/nft-adventure/art`)).art_nftAdventure_nftTextAdventure },
] as const;
export type ArtKey = typeof artIndex[number]['key'];
