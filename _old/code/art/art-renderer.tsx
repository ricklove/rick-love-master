import React, { } from 'react';
import { DivHost } from './div-host';
import { ArtWork, P5Constructor } from './artwork-type';

export const ArtRenderer = ({
    art,
    tokenId,
    showInfo,
    createP5,
}: {
    art: ArtWork;
    tokenId: string;
    showInfo: boolean;
    createP5?: P5Constructor;
}) => {

    const { renderArt, ArtComponent } = art;

    const ArtInfoComponent = () => {
        if (!showInfo){
            return <></>;
        }

        const tokenDescription = art.getTokenDescription(tokenId);

        return (
            <div style={{ position: `fixed`, left: 4, bottom: 4, maxWidth: `75%`, color: `white` }}>
                <div style={{ opacity: 0.5 }}>
                    <div style={{ padding: 4, whiteSpace: `pre-wrap` }}>{art.title}</div>
                    <div style={{ padding: 4, whiteSpace: `pre-wrap` }}>{art.artist}</div>
                    <div style={{ padding: 4, whiteSpace: `pre-wrap` }}>{art.description}</div>
                    {!!tokenDescription && <div style={{ padding: 4, whiteSpace: `pre-wrap`, wordBreak: `break-all` }}>{tokenDescription}</div>}
                </div>
                <div style={{ opacity: 0.75, padding: 4 }}>
                    <ReserveButton
                        artKey={art.key}
                        seed={tokenId}
                    />
                </div>
                <div style={{ marginTop: 8 }}>
                    <a href='/art'>🧙‍♂️ Other Art by Rick Love</a>
                </div>
            </div>
        );
    };

    if (renderArt) {

        const hostId = Math.random();

        return (
            <>
                {/* <div id={hostId}>
                </div> */}
                <DivHost
                    renderArt={(hostElement) => renderArt(hostElement, tokenId, null, createP5 ??
                        ((sketch, host) => {
                            console.error(`Missing createP5`);
                            return ({ remove: () => { /*Ignore*/ } });
                        }))}
                    openSea={art?.openSea} />
                <ArtInfoComponent/>
            </>
        );
    }

    if (ArtComponent) {
        return (
            <>
                <ArtComponent hash={tokenId} />
                <ArtInfoComponent/>
            </>
        );
    }

    return <></>;
};


export const ReserveButton = ({
    artKey,
    seed,
    walletAddress,
}: {
    artKey: string;
    seed?: string;
    walletAddress?: string;
}) => {

    const reserve = async () => {
        const nftUrl = `https://ricklove.me/art/${artKey}${seed ? `?seed=${seed}` : ``}`;
        const reserveMessage = `@RickLoveToldMe I want to reserve this NFT: ${nftUrl}${walletAddress && walletAddress !== seed ? ` for wallet=${walletAddress}` : ``}`;

        // Public message
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(reserveMessage)}`;

        // Direct message
        // const url = `https://twitter.com/messages/compose?recipient_id=1001&text=${encodeURIComponent(reserveMessage)}`;

        window.open(url, `_blank`);
        // window.location.href = url;
    };

    return (
        <>
            <div
                style={{
                    background: `#037dd6`,
                    color: `#FFFFFF`,
                    borderRadius: 4,
                    padding: 4,
                    textAlign: `center`,
                }}
                onClick={reserve}>{`Reserve NFT`}</div>
        </>
    );
};
