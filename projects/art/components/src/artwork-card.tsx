import React from 'react';
import { createRandomGenerator } from '@ricklove/art-common';
import { ArtworkMetadataWithExtra } from './types-components';

export const ArtworkCard = ({
  artwork,
  tokenId,
  index,
}: {
  artwork: ArtworkMetadataWithExtra;
  tokenId?: string;
  index: number;
}) => {
  const { random } = createRandomGenerator(artwork.key + tokenId);
  const flexDirection = ([`row`, `row-reverse`] as const)[Math.floor(2 * random())];

  return (
    <>
      <div style={{ display: `flex`, flexDirection, flexWrap: `wrap` }}>
        <div style={{ flex: 1, overflow: `hidden`, background: `#FFFFFF`, color: `#333333` }}>
          <ArtworkMetadataView artwork={artwork} tokenId={tokenId ?? `0`} />
        </div>
        <div style={{ flex: 1, overflow: `hidden` }}>
          <ArtworkPreview artwork={artwork} tokenId={tokenId ?? `0`} />
        </div>
      </div>
    </>
  );
};

export const ArtworkMetadataView = ({ artwork, tokenId }: { artwork: ArtworkMetadataWithExtra; tokenId: string }) => {
  const projectMetadata = artwork.projectMetadata;
  const tokenMetadata = artwork.getTokenMetadata(tokenId);

  return (
    <>
      <div>
        <div>{projectMetadata.title}</div>
        <div>{projectMetadata.artist}</div>
        <div>{projectMetadata.description}</div>
        <div>{tokenMetadata.tokenId}</div>
        {!!tokenMetadata.title && <div>{tokenMetadata.title}</div>}
        {!!tokenMetadata.description && <div>{tokenMetadata.description}</div>}
        {!!tokenMetadata.attributes &&
          tokenMetadata.attributes.map((x) => (
            <React.Fragment key={x.traitType}>
              <div>
                <div>{x.traitType}</div>
                <div>{x.value}</div>
              </div>
            </React.Fragment>
          ))}
      </div>
    </>
  );
};

export const ArtworkPreview = ({ artwork, tokenId }: { artwork: ArtworkMetadataWithExtra; tokenId: string }) => {
  return (
    <>
      <div>
        <img src={artwork.previewImageUrl} style={{ objectFit: `contain` }} />
      </div>
    </>
  );
};
