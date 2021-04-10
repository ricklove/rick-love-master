/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-default-export */
declare module 'whammy' {

    class Video {
        constructor(
            /**  Number of frames per second */
            frameRate: number,
            /**  Quality, default=0.8 */
            quality?: number,
        );

        add: (frame: HTMLCanvasElement, duration?: number) => void;

        compile: (outputAsArray?: false) => Blob;
        // compile: (u: false, callback: (output: Blob) => void) => void;
    }

    export class Whammy {
        Video: Video;
    }
}
