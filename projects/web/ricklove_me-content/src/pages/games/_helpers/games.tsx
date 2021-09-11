import React, { useState } from 'react';
import { gamesList } from '@ricklove/games-list';
import { AppComponentLoader } from '../../../components/app-component-loader';
import { Layout } from '../../../components/layout/layout';
import { SEO } from '../../../components/layout/seo';

export const gamesListData = [...gamesList.map((x) => ({ name: x.name }))];

// export const componentGameUtils = {
//   ...educationalGameUtils,
// };

export type GamePageData = {
  gameName: string;
};

export const GamePage = (props: { data: GamePageData }) => {
  return (
    <Layout gameMode>
      <SEO
        title={`Games: ${props.data.gameName}`}
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

export const GamesListPage = (_props: {}) => {
  const [game, setGame] = useState(null as null | string);
  const openLinkInSameView = (e: React.MouseEvent, gameName: string) => {
    setGame(gameName);
    // window.history.pushState({}, gameName);
  };
  const backToList = () => {
    setGame(null);
    // window.history.back();
  };
  return (
    <Layout gameMode>
      <SEO
        title='Games'
        meta={[
          { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
          { name: `apple-mobile-web-app-capable`, content: `yes` },
          { name: `mobile-web-app-capable`, content: `yes` },
        ]}
      />
      {/* <HostComponentAsync component={componentGameUtils.progressGame} /> */}
      {!game && (
        <div style={{ margin: 16 }}>
          <div>Games</div>
          {gamesList.map((x) => (
            <div key={x.name} className={`link`} style={{ padding: 4 }} onClick={(e) => openLinkInSameView(e, x.name)}>
              <span>🎮 {x.name}</span>
            </div>
          ))}
        </div>
      )}
      {!!game && (
        <>
          <HostComponentAuto data={{ gameName: game }} />
          <div className={`link`} style={{ display: `inline-block`, padding: 4 }} onClick={() => backToList()}>
            <span>🎮 Games</span>
          </div>
        </>
      )}
    </Layout>
  );
};

export const HostComponentAuto = (props: { data: GamePageData }) => {
  const { gameName } = props.data;
  const game = gamesList.find((x) => x.name === gameName);

  if (!game) {
    return (
      <div>
        <h1>GAME NOT FOUND</h1>
        <p>testName: {props.data.gameName}</p>
      </div>
    );
  }

  return <AppComponentLoader component={game} />;
};
