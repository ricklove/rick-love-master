import { Artwork } from '@ricklove/art-common';
import { AppError } from '@ricklove/utils-core';

export const createArtRenderer = async (artwork: Artwork, tokenId: string) => {
  if (artwork.kind === `p5`) {
    const { createArtRenderer_p5 } = await import(`./art-renderer-p5`);
    return createArtRenderer_p5(artwork, tokenId);
  }

  // const aNever: never = artwork;
  throw new AppError(`Unknown artwork kind`, { kind: artwork.kind, artwork });
};
