import { ArtworkComponentOptions, createArtworkComponentLoader } from '@ricklove/art-components';
import { metadata as metadata_circles } from '@ricklove/artwork-circles';

const _artworkList = [
  { metadata: metadata_circles, importModule: async () => await import(`@ricklove/artwork-circles`) },
];

export const artworkList = _artworkList
  .map((x) => ({
    ...x,
    loadArtwork: async () => (await x.importModule()).artwork,
  }))
  .map((x) => ({
    key: x.metadata.key,
    metadata: x.metadata,
    load: async (tokenId: string, options?: ArtworkComponentOptions) =>
      await createArtworkComponentLoader(await x.loadArtwork(), tokenId, options),
  }));
