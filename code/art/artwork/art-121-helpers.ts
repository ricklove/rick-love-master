export const parseTokenId_art121 = (tokenId: string) => {
    const tokenTimestampValue = Number.parseInt(tokenId.substr(0, tokenId.length - 6), 10);
    const tokenCounterValue = Number.parseInt(tokenId.substr(tokenId.length - 6), 10);
    console.log(`parseTokenId_art121`, { tokenId, tokenTimestampValue, tokenCounterValue });

    if (!Number.isFinite(tokenTimestampValue)) { return null; }
    if (!Number.isFinite(tokenCounterValue)) { return null; }

    const tokenCounter = tokenCounterValue;
    const timestampSecs = tokenTimestampValue;
    const targetSecs = Math.floor(new Date(`2021-01-21 21:21:21Z`).getTime()) / 1000;
    const timeDeltaSecs = Math.abs(targetSecs - timestampSecs);
    return {
        tokenId,
        tokenCounter,
        timestampSecs,
        targetSecs,
        timeDeltaSecs,
    };
};
