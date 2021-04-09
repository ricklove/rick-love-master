/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef } from 'react';
import { C } from 'controls-react';
import { useDebounce } from 'utils-react/hooks';
import { theme } from 'themes/theme';
import { art_circles } from './artwork/circles';
import { art_layersOfTheOnionsSoul } from './artwork/layers-of-the-onions-soul';
import { art_121 } from './artwork/art-121';
import { DivHost } from './div-host';
import { art_puzzle01 } from './artwork/puzzle/art-puzzle-01';
import { art_gears } from './artwork/gears';
import { ArtWork } from './artwork-type';
import { art_gpu_01 } from './artwork/gpu-01/gpu-01';
import { art_flyingColors } from './artwork/flying-colors/flying-colors';
import { art_exampleFluidSimulator } from './artwork/example-PavelDoGreat-fluid-simulation/example-fluid-simulator';

export const ArtGallery = (props: {}) => {
    const artItems: ArtWork[] = [
        art_exampleFluidSimulator,
        art_flyingColors,
        art_gpu_01,
        art_gears,
        art_puzzle01,
        art_121,
        art_circles,
        art_layersOfTheOnionsSoul,
    ];

    const art = useRef(artItems[0]);

    const [renderId, setRenderId] = useState(0);
    const [showNavigation, setShowNavigation] = useState(true);
    const [tokenId, setTokenId] = useState(`0`);
    const [isFullScreen, setIsFullScreen] = useState(false);

    type ArtRender = {
        kind: 'div';
        renderArt: (hostElement: HTMLDivElement) => { remove: () => void };
        openSea?: ArtWork['openSea'];
    } | {
        kind: 'react';
        ArtComponent: () => JSX.Element;
        openSea?: ArtWork['openSea'];
    };
    const [tokenDescription, setTokenDescription] = useState(null as null | string);

    const { debounce } = useDebounce(250);

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
        console.log(`changeTokenId`, { value });

        setTokenId(value);

        debounce(() => {
            console.log(`changeTokenId debounce`, { value });
            setTokenDescription(art.current.getTokenDescription(value));
            const { renderArt, ArtComponent } = art.current;
            if (renderArt) {
                cacheRenderArtwork({
                    kind: `div`,
                    renderArt: (hostElement) => renderArt(hostElement, value),
                    openSea: art.current.openSea,
                });
            } else if (ArtComponent) {
                cacheRenderArtwork({
                    kind: `react`,
                    ArtComponent: () => <ArtComponent hash={value} />,
                    openSea: art.current.openSea,
                });
            }
        });
    };

    const ArtworkComponentRef = useRef(<></>);
    const cacheRenderArtwork = (artRenderer: ArtRender) => {
        ArtworkComponentRef.current = (
            <>
                {artRenderer?.kind === `div` && (
                    <DivHost renderArt={artRenderer.renderArt} openSea={artRenderer.openSea} />
                )}
                {artRenderer?.kind === `react` && (
                    <artRenderer.ArtComponent />
                )}
                <div style={{ position: `absolute`, top: 4, right: 4, width: 16, height: 16, fontFamily: `monospace`, fontSize: 14, lineHeight: `16px`, textAlign: `center`, color: `#FFFFFF`, background: `#88888888` }}
                    onClick={() => setIsFullScreen(s => !s)}>{isFullScreen ? `-` : `+`}</div>
            </>
        );
        setRenderId(s => s + 1);
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
                <div style={isFullScreen ? { position: `fixed`, left: 0, right: 0, top: 0, bottom: 0, background: `#000000` } : { maxWidth: `600px`, maxHeight: `600px` }}>
                    <div style={{ position: `relative`, width: `100%`, height: `100%` }} >
                        {ArtworkComponentRef.current}
                    </div>
                </div>
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
