import React from 'react';
import { css, Global } from '@emotion/react';
import { ArtworkMetadata, createRandomGenerator } from '@ricklove/art-common';
import { ArtworkCard } from './artwork-card';

// https://jsfiddle.net/6sjkvxgq/

const styles = css`
  .art-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 1em 1em;
    grid-auto-flow: row dense;
  }
  .art-item {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 0.25em;
  }
  .art-item-wide {
    grid-column: auto / span 2;
    grid-row: auto / span 1;
  }
  .art-item-tall {
    grid-column: auto / span 1;
    grid-row: auto / span 2;
  }
`;

export const ArtworkGallery = ({ artworkItems }: { artworkItems: { metadata: ArtworkMetadata }[] }) => {
  // TESTING
  const { random } = createRandomGenerator(`42`);
  const artworkItemsSamples = [...new Array(10)].flatMap((_) =>
    artworkItems.map((x) => ({ artwork: x, tokenId: `` + 100 * random() })),
  );

  return (
    <>
      <Global styles={styles} />
      <div className='art-gallery'>
        {artworkItemsSamples.map((x, i) => (
          <React.Fragment key={x.artwork.metadata.key}>
            <ArtworkCard artwork={x.artwork.metadata} tokenId={x.tokenId} index={i} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
};
