/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';
import { componentGamesList } from './component-games-list';


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

    const openLinkInSameWebApp = (url: string) => {
        window.location.href = url;
        return false;
    };
    return (
        <Layout>
            <SEO title='Games' meta={[
                { name: `viewport`, content: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no` },
                { name: `apple-mobile-web-app-capable`, content: `yes` },
                { name: `mobile-web-app-capable`, content: `yes` },
            ]} />
            <div>
                <div>Games</div>
                {componentGamesList.map(x => (
                    <div key={x.name} style={{ padding: 4 }}>
                        <a onClick={() => openLinkInSameWebApp(`/games/${x.name}`)}>{x.name}</a>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

const HostComponentAuto = (props: { data: ComponentGamesPageData }) => {
    const { gameName } = props.data;
    const game = componentGamesList.find(x => x.name === gameName);

    const { LoadedComponent, load } = useLoadable(game?.load ?? (async () => (await import(`./component-tests-not-found`)).EmptyComponent));
    useEffect(() => { (async () => await load())(); }, [load]);
    return (
        <div>
            {LoadedComponent && <LoadedComponent />}
            {!game && (
                <>
                    <h1>GAME NOT FOUND</h1>
                    <p>testName: {props.data.gameName}</p>
                </>
            )}
        </div>
    );
};
