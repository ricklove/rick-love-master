import React, { useEffect, useState, useRef } from 'react';
import { C } from 'controls-react';
import { useDebounce } from 'utils-react/hooks';
import { theme } from 'themes/theme';
import { DivHost } from './div-host';
import { ArtWork } from './artwork-type';
import { CanvasVideoRecorderControl, createRecorder } from './canvas-video-recording/canvas-video-recorder';
import { artItems } from './art-items';

export const ArtGallery = (props: {}) => {

    const queryParts = document.location.search.substr(1).split(`&`);
    const artKey = queryParts.find(x => x.startsWith(`key`))?.split(`=`)[1] ?? document.location.pathname.match(/art\/([^/]+)/)?.[1];
    const newTokenId = queryParts.find(x => x.startsWith(`tokenId`))?.split(`=`)[1];
    const showCamera = document.location.search.includes(`camera=true`);

    const art = useRef(null as null | ArtWork);
    const recorderRef = useRef(showCamera ? createRecorder() : null as null | ReturnType<typeof createRecorder>);

    const [renderId, setRenderId] = useState(0);
    const [showNavigation, setShowNavigation] = useState(true);
    const [tokenId, setTokenId] = useState(`0`);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [customSize, setCustomSize] = useState(null as null | { width: number, height: number });

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

        // const camera = queryParts.find(x => x.startsWith(`camera`))?.split(`=`)[1];
        // if (camera) { recorderRef.current = createRecorder(); }

        if (!artKey) { changeTokenId(`0`); return; }
        const artworkItem = artItems.find(x => x.key === artKey);
        if (!artworkItem) { changeTokenId(`0`); return; }

        art.current = artworkItem;

        // setShowNavigation(false);
        setIsFullScreen(true);
        changeTokenId(`${newTokenId || tokenId}`);
    }, [document.location.search]);

    const prepareTarget = () => {
        if (!recorderRef.current) { return; }

        const settings = recorderRef.current.getSettings();
        if (!settings) { return; }

        setCustomSize({ width: settings.width, height: settings.height });
        recorderRef.current.setTargetReady();
    };

    const changeArt = (value: ArtWork) => {
        art.current = value;
        window.location.pathname = `/art/${value.key}`;
        // changeTokenId(tokenId);
    };

    const changeTokenId = (value: string) => {
        console.log(`changeTokenId`, { value });

        setTokenId(value);

        debounce(() => {
            console.log(`changeTokenId debounce`, { value });
            if (!art.current){ return; }

            setTokenDescription(art.current.getTokenDescription(value));
            const { renderArt, ArtComponent } = art.current;
            if (renderArt) {
                cacheRenderArtwork({
                    kind: `div`,
                    renderArt: (hostElement) => renderArt(hostElement, value, recorderRef.current),
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

                {art.current && (
                    <>
                        <C.Text_FormTitle style={{ ...theme.text_formTitle, whiteSpace: `pre-wrap` }}>{art.current.title}</C.Text_FormTitle>
                        <C.Text_FormTitle style={{ ...theme.text_formTitle, whiteSpace: `pre-wrap` }}>{art.current.artist}</C.Text_FormTitle>
                        <div style={customSize ? { position: `fixed`, left: 0, right: 0, top: 0, bottom: 0, background: `#000000` }
                            : isFullScreen ? { position: `fixed`, left: 0, right: 0, top: 0, bottom: 0, background: `#000000` }
                                : { maxWidth: `600px`, maxHeight: `600px` }}>
                            <div style={{ position: `relative`, width: `100%`, height: `100%`, ...customSize ?? {} }} >
                                {ArtworkComponentRef.current}
                                <div style={{ position: `absolute`, top: 4, right: 4, width: 16, height: 16, fontFamily: `monospace`, fontSize: 14, lineHeight: `16px`, textAlign: `center`, color: `#FFFFFF`, background: `#88888888` }}
                                    onClick={() => setIsFullScreen(s => !s)}>{isFullScreen ? `-` : `+`}</div>
                                {isFullScreen && (
                                    <div style={{ position: `fixed`, right: 0, bottom: 0 }}>
                                        <a href='/art'>🧙‍♂️ Other Art by Rick Love</a>
                                    </div>
                                )}
                            </div>
                        </div>
                        {recorderRef.current && (
                            <div style={{ position: `fixed`, right: 0, bottom: 0 }} >
                                <CanvasVideoRecorderControl recorder={recorderRef.current} onPrepareTarget={prepareTarget} />
                            </div>
                        )}
                        {tokenDescription && (<C.Text_FormTitle style={{ ...theme.text_formTitle, background: `#EEEEEE`, padding: 8, whiteSpace: `pre-wrap` }}>{tokenDescription}</C.Text_FormTitle>)}
                        <C.Text_FormTitle style={{ ...theme.text_formTitle, whiteSpace: `pre-wrap` }}>{art.current.description}</C.Text_FormTitle>
                    </>
                )}
            </C.View_Panel>
            {!showNavigation && (
                <div style={{ padding: 16, fontSize: 16 }}>
                    <a href='/art'>Other Art by Rick Love</a>
                </div>
            )}
        </>
    );
};
