import { ArtworkMetadata } from '@ricklove/art-common';

export type ArtworkMetadataWithExtra = ArtworkMetadata & {
  previewImageUrl: string;
};
