/* eslint-disable react/require-default-props */
import React, { useEffect, useRef } from 'react';


// const hasLoadedScript = false;

export const DivHost = (props: {
    renderArt: (hostElement: HTMLDivElement) => { remove: () => void };
    // eslint-disable-next-line react/no-unused-prop-types
    openSea?: {
        tokenAddress: string;
        tokenId: string;
    };
}) => {

    const hostElementRef = useRef(null as null | HTMLDivElement);
    const HostElement = useRef({ Component: () => <div style={{ width: `100%`, height: `100%` }} ref={hostElementRef} /> });

    useEffect(() => {
        // if (!hasLoadedScript) {
        //     hasLoadedScript = true;
        //     const scriptElement = document.createElement(`script`);
        //     scriptElement.src = `https://unpkg.com/embeddable-nfts/dist/nft-card.min.js`;
        //     document.head.append(scriptElement);
        // }

        if (!hostElementRef.current) { return () => { }; }

        console.log(`DivHost - renderArt`, { hostElementRef: hostElementRef.current, renderArt: props.renderArt });
        hostElementRef.current.innerHTML = ``;
        const { remove } = props.renderArt(hostElementRef.current);
        return () => {
            remove();
        };
    }, [hostElementRef.current, props.renderArt]);


    return (
        <>
            <HostElement.current.Component />
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
