import { ArtworkMetadata } from '@ricklove/art-common';

export const metadata: ArtworkMetadata = {
  key: `circles`,
  projectMetadata: {
    title: `Circles`,
    description: `The circles we travel in life always bring us back home.`,
    artist: `Rick Love`,
  },
  getTokenMetadata: (tokenId) => {
    return {
      tokenId,
    };
  },
};
