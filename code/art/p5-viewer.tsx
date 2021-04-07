/* eslint-disable react/require-default-props */
import React, { useEffect, useRef } from 'react';


const hasLoadedScript = false;

export const P5Viewer = (props: {
    renderArt: (hostElement: HTMLDivElement) => { remove: () => void };
    // eslint-disable-next-line react/no-unused-prop-types
    openSea?: {
        tokenAddress: string;
        tokenId: string;
    };
}) => {

    const hostElementRef = useRef(null as null | HTMLDivElement);

    useEffect(() => {
        // if (!hasLoadedScript) {
        //     hasLoadedScript = true;
        //     const scriptElement = document.createElement(`script`);
        //     scriptElement.src = `https://unpkg.com/embeddable-nfts/dist/nft-card.min.js`;
        //     document.head.append(scriptElement);
        // }

        if (!hostElementRef.current) { return () => { }; }

        console.log(`P5Viewer - renderArt`, { renderArt: props.renderArt });
        hostElementRef.current.innerHTML = ``;
        const { remove } = props.renderArt(hostElementRef.current);
        return () => {
            remove();
        };
    }, [hostElementRef.current, props.renderArt]);

    return (
        <>
            <div style={{}} ref={hostElementRef} />
            {/* {props.openSea && (
                <>
                    <div>Open Sea</div>
                    <nft-card
                        tokenAddress={props.openSea.tokenAddress}
                        tokenId={props.openSea.tokenId}
                        network='mainnet'
                    />
                </>
            )} */}
        </>
    );
};
