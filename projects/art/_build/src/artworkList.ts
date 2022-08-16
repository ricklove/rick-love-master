import { Artwork, ArtworkMetadata } from '@ricklove/art-common';
import { ArtworkComponentOptions, createArtworkLiveViewLoader } from '@ricklove/art-components';
import { metadata as metadata_circles } from '@ricklove/artwork-circles';
export { ArtworkMetadata } from '@ricklove/art-common';

const _artworkList = [
  {
    metadata: metadata_circles,
    artworkDirectoryName: `circles`,
    //previewTokenIds: `42 76`.split(` `),
    previewTokenIds: [...new Array(20).keys()].map((x) => `${x}`),
    importModule: async () => await import(`@ricklove/artwork-circles`),
  },
  // {
  //   metadata: metadata_hashing,
  //   artworkDirectoryName: `hashing`,
  //   importModule: async () => await import(`@ricklove/artwork-hashing`),
  // },
];

export type ArtworkItem = {
  key: string;
  artworkDirectoryName: string;
  previewTokenIds: string[];
  metadata: ArtworkMetadata;
  importModule: () => Promise<{ metadata: ArtworkMetadata; artwork: Artwork }>;
  load: (tokenId: string, options?: ArtworkComponentOptions) => Promise<(props: { config: {} }) => JSX.Element>;
};
export const artworkList: ArtworkItem[] = _artworkList
  .map((x) => ({
    ...x,
    loadArtwork: async () => (await x.importModule()).artwork,
  }))
  .map((x) => ({
    key: x.metadata.key,
    metadata: x.metadata,
    artworkDirectoryName: x.artworkDirectoryName,
    previewTokenIds: x.previewTokenIds,
    importModule: x.importModule,
    load: async (tokenId: string, options?: ArtworkComponentOptions) =>
      await createArtworkLiveViewLoader(await x.loadArtwork(), tokenId, options),
  }));
