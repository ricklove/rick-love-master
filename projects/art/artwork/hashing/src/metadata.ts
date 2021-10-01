import { ArtworkMetadata } from '@ricklove/art-common';

export const metadata: ArtworkMetadata = {
  key: `hashing`,
  projectMetadata: {
    title: `Hashing`,
    description: `One of these has to be right.`,
    artist: `Rick Love`,
  },
  getTokenMetadata: (tokenId) => {
    return {
      tokenId,
    };
  },
};
