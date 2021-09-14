import React, { useState } from 'react';
import { artworkList as artworkListRaw } from '@ricklove/art-build';
import { AppComponentLoader } from '../../../components/app-component-loader';
import { Layout } from '../../../components/layout/layout';
import { SEO } from '../../../components/layout/seo';

export const artworkList: ArtworkPageData[] = [
  ...artworkListRaw.map((x) => ({ key: x.key, title: x.metadata.projectMetadata.title })),
];

export type ArtworkPageData = {
  key: string;
  title: string;
};

export const ArtworkPage = (props: { data: ArtworkPageData }) => {
  return (
    <Layout gameMode>
      <SEO
        title={`Art: ${props.data.title}`}
        meta={[
          { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
          { name: `apple-mobile-web-app-capable`, content: `yes` },
          { name: `mobile-web-app-capable`, content: `yes` },
        ]}
      />
      <HostComponentAuto data={props.data} />
    </Layout>
  );
};

export const ArtworkListPage = (_props: {}) => {
  const [artworkItem, setArtworkItem] = useState(null as null | ArtworkPageData);
  const openLinkInSameView = (e: React.MouseEvent, artworkKey: ArtworkPageData) => {
    setArtworkItem(artworkKey);
    // window.history.pushState({}, gameName);
  };
  const backToList = () => {
    setArtworkItem(null);
    // window.history.back();
  };
  return (
    <Layout gameMode>
      <SEO
        title='Art Gallery'
        meta={[
          { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
          { name: `apple-mobile-web-app-capable`, content: `yes` },
          { name: `mobile-web-app-capable`, content: `yes` },
        ]}
      />
      {/* <HostComponentAsync component={componentGameUtils.progressGame} /> */}
      {!artworkItem && (
        <div style={{ margin: 16 }}>
          <div>Art Gallery</div>
          {artworkList.map((x) => (
            <div key={x.key} className={`link`} style={{ padding: 4 }} onClick={(e) => openLinkInSameView(e, x)}>
              <span>🎨 {x.title}</span>
            </div>
          ))}
        </div>
      )}
      {!!artworkItem && (
        <>
          <HostComponentAuto data={artworkItem} />
          <div className={`link`} style={{ display: `inline-block`, padding: 4 }} onClick={() => backToList()}>
            <span>🎨 Back to Gallery</span>
          </div>
        </>
      )}
    </Layout>
  );
};

export const HostComponentAuto = (props: { data: ArtworkPageData }) => {
  const artworkItem = props.data;
  const artwork = artworkListRaw.find((x) => x.key === artworkItem.key);

  if (!artwork) {
    return (
      <div>
        <h1>ARTWORK NOT FOUND</h1>
        <p>title: {artworkItem.title}</p>
      </div>
    );
  }

  return (
    <AppComponentLoader
      component={{
        name: artwork.key,
        load: async () => {
          // Get tokenId
          const tokenId =
            window.document.location.search
              .split(`&`)
              .find((x) => x.includes(`tokenId=`))
              ?.split(`=`)?.[1] ?? `0`;

          const options = {
            isPaused: window.document.location.search.includes(`pause`),
          };

          return await artwork.load(tokenId, options);
        },
      }}
    />
  );
};
