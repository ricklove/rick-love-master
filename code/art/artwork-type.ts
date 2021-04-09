export type ArtWork = {
    key: string;
    title: string;
    description: string;
    artist: string;
    openSea?: {
        tokenAddress: string;
        tokenId: string;
    };
    getTokenDescription: (tokenId: string) => null | string;
    renderArt?: (hostElement: HTMLDivElement, hash: string) => { remove: () => void };
    ArtComponent?: (props: { hash: string }) => JSX.Element;
};
