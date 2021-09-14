const globalArtControllerKey = `__globalArtController` as const;

export type GlobalArtControllerType = {
    play: () => void;
    pause: () => void;
    nextFrame: (framesPerSecond: number) => { isDone: boolean };
};

declare const window: { [globalArtControllerKey]: undefined | GlobalArtControllerType };
 const setupGlobalArtController = (controller: GlobalArtControllerType) => {
    window[globalArtControllerKey] = controller;
    return {
        remove: () => {
            if (window[globalArtControllerKey] !== controller){return;}
            window[globalArtControllerKey] = undefined;
        },
    };
};
 const getGlobalArtController = () => {
    if (!(globalArtControllerKey in window)){ return undefined;}
    return window[globalArtControllerKey];
};

export const GlobalArtController = {
    key: globalArtControllerKey,
    setup: setupGlobalArtController,
    get: getGlobalArtController,
};
