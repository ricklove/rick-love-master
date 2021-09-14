import { Artwork, ArtworkMetadata } from '@ricklove/art-common';
import { createArtworkComponentLoader } from '@ricklove/art-components';
import { metadata as metadata_circles } from '@ricklove/artwork-circles';

export const artworkList: { metadata: ArtworkMetadata; loadArtwork: () => Promise<Artwork> }[] = [
  { metadata: metadata_circles, loadArtwork: async () => (await import(`@ricklove/artwork-circles`)).artwork },
];

export const artworkComponentList = artworkList.map((x) => ({
  name: x.metadata.key,
  load: async () => await createArtworkComponentLoader(await x.loadArtwork(), `0`),
}));
