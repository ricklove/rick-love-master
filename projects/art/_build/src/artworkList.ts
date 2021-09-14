import { Artwork, ArtworkMetadata } from '@ricklove/art-common';
import { createArtworkComponentLoader } from '@ricklove/art-components';
import { metadata as metadata_circles } from '@ricklove/artwork-circles';

const _artworkList: { metadata: ArtworkMetadata; loadArtwork: () => Promise<Artwork> }[] = [
  { metadata: metadata_circles, loadArtwork: async () => (await import(`@ricklove/artwork-circles`)).artwork },
];

export const artworkList = _artworkList.map((x) => ({
  key: x.metadata.key,
  metadata: x.metadata,
  load: async (tokenId: string) => await createArtworkComponentLoader(await x.loadArtwork(), tokenId),
}));
