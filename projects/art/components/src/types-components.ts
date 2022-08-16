import { ArtworkMetadata } from '@ricklove/art-common';

export type ArtworkMetadataWithExtra = ArtworkMetadata & {
  previewTokenId: string;
  previewImageUrl: string;
};
