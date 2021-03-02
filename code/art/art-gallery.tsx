import React, { useEffect, useState, useRef } from 'react';
import { C } from 'controls-react';
import { useDebounce } from 'utils-react/hooks';
import { theme } from 'themes/theme';
import { art_circles } from './artwork/circles';
import { art_layersOfTheOnionsSoul } from './artwork/layers-of-the-onions-soul';
import { art_121 } from './artwork/art-121';
import { P5Viewer } from './p5-viewer';
import { art_puzzle01 } from './artwork/puzzle/art-puzzle-01';
import { art_gears } from './artwork/gears';

export const ArtGallery = (props: {}) => {
    const artItems = [
        art_gears,
        art_puzzle01,
        art_121,
        art_circles,
        art_layersOfTheOnionsSoul,
    ];

    const art = useRef(artItems[0]);
    const [showNavigation, setShowNavigation] = useState(true);
    const [tokenId, setTokenId] = useState(`0`);

    type ArtRender = {
        kind: 'p5';
        renderArt: (hostElement: HTMLDivElement) => { remove: () => void };
    } | {
        kind: 'react';
        ArtComponent: () => JSX.Element;
    };
    const [artRenderer, setArtRenderer] = useState({
        kind: `p5`,
        renderArt: () => { return { remove: () => { } }; },
    } as ArtRender);
    const [tokenDescription, setTokenDescription] = useState(null as null | string);

    const { debounce } = useDebounce(50);

    useEffect(() => {
        const queryParts = document.location.search.substr(1).split(`&`);
        const artKey = queryParts.find(x => x.startsWith(`key`))?.split(`=`)[1];
        if (!artKey) { changeTokenId(`0`); return; }
        const artworkItem = artItems.find(x => x.key === artKey);
        if (!artworkItem) { changeTokenId(`0`); return; }

        art.current = artworkItem;
        const newTokenId = queryParts.find(x => x.startsWith(`tokenId`))?.split(`=`)[1];

        setShowNavigation(false);
        changeTokenId(`${newTokenId || tokenId}`);
    }, [document.location.search]);

    const changeArt = (value: typeof artItems[0]) => {
        art.current = value;
        changeTokenId(tokenId);
    };

    const changeTokenId = (value: string) => {
        setTokenId(value);

        debounce(() => {
            setArtRenderer({
                kind: `p5`,
                renderArt: (hostElement) => art.current.renderArt(hostElement, value),
            });
            setTokenDescription(art.current.getTokenDescription(value));
        });
    };

    return (
        <>
            <C.View_Panel>
                {showNavigation && (
                    <C.View_Form>
                        {artItems.map(x => (
                            <React.Fragment key={x.title}>
                                <div style={{ paddingBottom: 4 }}>
                                    <C.Button_FormAction onPress={() => changeArt(x)}>{x.title}</C.Button_FormAction>
                                </div>
                            </React.Fragment>
                        ))}
                        <C.View_FieldRow>
                            <C.Text_FormTitle>Enter a preview tokenId:</C.Text_FormTitle>
                            <C.Input_Text value={tokenId} onChange={changeTokenId} />
                        </C.View_FieldRow>
                    </C.View_Form>
                )}


                <C.Text_FormTitle style={{ ...theme.text_formTitle, whiteSpace: `pre-wrap` }}>{art.current.title}</C.Text_FormTitle>
                <C.Text_FormTitle style={{ ...theme.text_formTitle, whiteSpace: `pre-wrap` }}>{art.current.artist}</C.Text_FormTitle>
                {artRenderer.kind === `p5` && (
                    <P5Viewer renderArt={artRenderer.renderArt} />
                )}
                {artRenderer.kind === `react` && (
                    <artRenderer.ArtComponent />
                )}
                {tokenDescription && (<C.Text_FormTitle style={{ ...theme.text_formTitle, background: `#EEEEEE`, padding: 8, whiteSpace: `pre-wrap` }}>{tokenDescription}</C.Text_FormTitle>)}
                <C.Text_FormTitle style={{ ...theme.text_formTitle, whiteSpace: `pre-wrap` }}>{art.current.description}</C.Text_FormTitle>
            </C.View_Panel>
            {!showNavigation && (
                <div style={{ padding: 16, fontSize: 16 }}>
                    <a href='/art'>Other Art by Rick Love</a>
                </div>
            )}
        </>
    );
};
