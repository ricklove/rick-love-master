/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';
import { componentGamesList, componentGameUtils } from './component-games-list';


export type ComponentGamesPageData = {
    gameName?: string;
    showList?: boolean;
};


export const ComponentGamesPage = (props: { data: ComponentGamesPageData }) => {

    if (props.data.showList) {
        return <ComponentGamesListPage />;
    }

    return (
        <Layout gameMode>
            <SEO title={`Games: ${props.data.gameName}`} meta={[
                { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
                { name: `apple-mobile-web-app-capable`, content: `yes` },
                { name: `mobile-web-app-capable`, content: `yes` },
            ]} />
            <HostComponentAuto data={props.data} />
        </Layout>
    );
};

const ComponentGamesListPage = (props: {}) => {

    const [game, setGame] = useState(null as null | string);
    const openLinkInSameView = (e: React.MouseEvent, gameName: string) => {
        setGame(gameName);
    };
    return (
        <Layout gameMode>
            <SEO title='Games' meta={[
                { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
                { name: `apple-mobile-web-app-capable`, content: `yes` },
                { name: `mobile-web-app-capable`, content: `yes` },
            ]} />
            <HostComponentAsync component={componentGameUtils.progressGame} />
            {!game && (
                <div style={{ margin: 16 }}>
                    <div>Games</div>
                    {componentGamesList.map(x => (
                        <div key={x.name} style={{ padding: 4 }} onClick={(e) => openLinkInSameView(e, x.name)}>
                            <span>🎮 {x.name}</span>
                        </div>
                    ))}
                </div>
            )}
            {!!game && (
                <>
                    <div style={{ display: `inline-block` }} onClick={() => setGame(null)}>
                        <span>🎮 Games</span>
                    </div>
                    <HostComponentAuto data={{ gameName: game }} />
                </>
            )}
        </Layout>
    );
};


const HostComponentAuto = (props: { data: ComponentGamesPageData }) => {
    const { gameName } = props.data;
    const game = componentGamesList.find(x => x.name === gameName);

    if (!game) {
        return (
            <div>
                <h1>GAME NOT FOUND</h1>
                <p>testName: {props.data.gameName}</p>
            </div>
        );
    }

    return <HostComponentAsync component={game} />;
};


const HostComponentAsync = ({ component }: { component: { name: string, load: () => Promise<(props: {}) => JSX.Element> } }) => {
    const { LoadedComponent, load } = useLoadable(component?.load ?? (async () => (await import(`./component-tests-not-found`)).EmptyComponent));
    useEffect(() => { (async () => await load())(); }, [load]);
    return (
        <div>
            {LoadedComponent && <LoadedComponent />}
        </div>
    );
};
