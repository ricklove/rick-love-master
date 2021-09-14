import { Artwork } from '@ricklove/art-common';
import { AppError } from '@ricklove/utils-core';
import { createArtRenderer_p5 } from './art-renderer-p5';

export const createArtRenderer = (artwork: Artwork, tokenId: string) => {
  if (artwork.kind === `p5`) {
    return createArtRenderer_p5(artwork, tokenId);
  }

  // const aNever: never = artwork;
  throw new AppError(`Unknown artwork kind`, { kind: artwork.kind, artwork });
};
