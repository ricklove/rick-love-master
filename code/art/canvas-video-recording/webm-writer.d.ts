/* eslint-disable import/no-default-export */
declare module 'webm-writer' {

    export default class WebMWriter {
        constructor(options: {
            /** WebM image quality from 0.0 (worst) to 0.99999 (best), 1.00 (VP8L lossless) is not supported */
            quality: number;
            /** Duration of frames in milliseconds */
            frameDuration?: number;
            /**  Number of frames per second */
            frameRate?: number;

            /** FileWriter in order to stream to a file instead of buffering to memory (optional) */
            fileWriter?: null;
            /** Node.js file handle to write to instead of buffering to memory (optional) */
            fd?: null;

            /** True if an alpha channel should be included in the video */
            transparent?: boolean;
            /** Allows you to set the quality level of the alpha channel separately.
             *  If not specified this defaults to the same value as `quality`. 
             * */
            alphaQuality?: number;
        });

        addFrame: (canvas: HTMLCanvasElement) => void;

        complete: () => Promise<Blob>;
    }
}
