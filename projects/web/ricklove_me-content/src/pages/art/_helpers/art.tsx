import React, { useState } from 'react';
import { artworkComponentList } from '@ricklove/art-build';
import { AppComponentLoader } from '../../../components/app-component-loader';
import { Layout } from '../../../components/layout/layout';
import { SEO } from '../../../components/layout/seo';

export const artworkList = [...artworkComponentList.map((x) => ({ name: x.name }))];

// export const componentGameUtils = {
//   ...educationalGameUtils,
// };

export type ArtworkPageData = {
  artworkName: string;
};

export const ArtworkPage = (props: { data: ArtworkPageData }) => {
  return (
    <Layout gameMode>
      <SEO
        title={`Art: ${props.data.artworkName}`}
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
  const [artworkKey, setArtworkKey] = useState(null as null | string);
  const openLinkInSameView = (e: React.MouseEvent, gameName: string) => {
    setArtworkKey(gameName);
    // window.history.pushState({}, gameName);
  };
  const backToList = () => {
    setArtworkKey(null);
    // window.history.back();
  };
  return (
    <Layout gameMode>
      <SEO
        title='Artworks'
        meta={[
          { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
          { name: `apple-mobile-web-app-capable`, content: `yes` },
          { name: `mobile-web-app-capable`, content: `yes` },
        ]}
      />
      {/* <HostComponentAsync component={componentGameUtils.progressGame} /> */}
      {!artworkKey && (
        <div style={{ margin: 16 }}>
          <div>Games</div>
          {artworkList.map((x) => (
            <div key={x.name} className={`link`} style={{ padding: 4 }} onClick={(e) => openLinkInSameView(e, x.name)}>
              <span>🎮 {x.name}</span>
            </div>
          ))}
        </div>
      )}
      {!!artworkKey && (
        <>
          <HostComponentAuto data={{ artworkName: artworkKey }} />
          <div className={`link`} style={{ display: `inline-block`, padding: 4 }} onClick={() => backToList()}>
            <span>🎮 Games</span>
          </div>
        </>
      )}
    </Layout>
  );
};

export const HostComponentAuto = (props: { data: ArtworkPageData }) => {
  const { artworkName: artworkKey } = props.data;
  const artwork = artworkComponentList.find((x) => x.name === artworkKey);

  if (!artwork) {
    return (
      <div>
        <h1>ARTWORK NOT FOUND</h1>
        <p>artworkKey: {props.data.artworkName}</p>
      </div>
    );
  }

  return <AppComponentLoader component={artwork} />;
};
