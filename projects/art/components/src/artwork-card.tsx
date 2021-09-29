import React from 'react';
import { ArtworkMetadata, createRandomGenerator } from '@ricklove/art-common';

export const ArtworkCard = ({
  artwork,
  tokenId,
  index,
}: {
  artwork: ArtworkMetadata;
  tokenId?: string;
  index: number;
}) => {
  const { random } = createRandomGenerator(artwork.key + tokenId);
  const styleClass = ([`art-item-wide`, `art-item-tall`] as const)[Math.floor(2 * random())];

  return (
    <>
      <div className={`art-item ${styleClass}`}>
        <div style={{ width: 150, height: 150, overflow: `hidden`, background: `#FFFFFF`, color: `#333333` }}>
          <ArtworkMetadataView artwork={artwork} tokenId={tokenId ?? `0`} />
        </div>
        <div style={{ width: 150, height: 150, overflow: `hidden` }}>
          <ArtworkPreview artwork={artwork} tokenId={tokenId ?? `0`} />
        </div>
      </div>
    </>
  );
};

export const ArtworkMetadataView = ({ artwork, tokenId }: { artwork: ArtworkMetadata; tokenId: string }) => {
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

export const ArtworkPreview = ({ artwork, tokenId }: { artwork: ArtworkMetadata; tokenId: string }) => {
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
