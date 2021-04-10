/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAutoLoadingError } from 'utils-react/hooks';
import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { TimeProvider } from '../time-provider';

export const createRecorder = () => {

    let _settings: null | { framesPerSecond: number, quality?: number, width: number, height: number } = null;

    let timeMsLost = 0;
    let timeMs = Date.now();
    let isRecording = false;
    let mode = `waitingForFrame` as `waitingForFrame` | `processingFrame` | 'processingVideo';
    let workingCanvas = null as null | HTMLCanvasElement;
    let workingContext = null as null | CanvasRenderingContext2D;
    let blobs = null as null | Blob[];

    const timeProvider: TimeProvider = {
        now: () => isRecording ? timeMs : (Date.now() - timeMsLost),
        isPaused: () => isRecording ? mode === `processingFrame` : false,
    };

    const start = (settings: NonNullable<typeof _settings>) => {
        if (isRecording || mode === `processingVideo`) { return; }

        _settings = settings;

        // Copy the canvas
        workingCanvas = document.createElement(`canvas`);
        workingCanvas.width = _settings.width;
        workingCanvas.height = _settings.height;
        document.body.append(workingCanvas);

        workingContext = workingCanvas.getContext(`2d`);

        blobs = [];

        timeMs = timeProvider.now();
        isRecording = true;
        mode = `waitingForFrame`;
    };

    const completeToBlob = async () => {
        if (!blobs || !_settings) { throw new Error(`Recorder has not started`); }
        console.log(`completeToBlob.compile started`);

        isRecording = false;
        timeMsLost = Date.now() - timeMs;
        mode = `processingVideo`;


        try {
            // const webMBlob = new Blob(blobs, { type: `video/webm; codecs=vp9` });
            // const webMBlob = new Blob(blobs, { type: `video/webm` });

            // const webMBlob = new Blob(blobs, { type: `image/webp[array]?` });
            // const webMBlob = new Blob(blobs[0], { type: `image/webp` });


            const ffmpeg = createFFmpeg({});
            await ffmpeg.load();

            // Write images to virtual file system
            // https://github.com/welefen/canvas2video/blob/master/src/index.ts
            for (const [i, blob] of blobs.entries()) {
                const buffer = await blob.arrayBuffer();
                ffmpeg.FS(`writeFile`, `image${`${i}`.padStart(3, `0`)}.webp`, new Uint8Array(buffer));
            }

            // Run ffmpeg as slideshow
            // https://trac.ffmpeg.org/wiki/Slideshow
            // ffmpeg -framerate 24 -i img%03d.png output.mp4
            await ffmpeg.run(...`-framerate ${_settings.framesPerSecond} -i image%03d.webp output.mp4`.split(` `));

            const data = ffmpeg.FS(`readFile`, `output.mp4`);
            const videoBlob = new Blob([data.buffer], { type: `video/mp4` });

            console.log(`completeToBlob.compile done`, { videoBlob });

            return videoBlob;

        } catch (err) {
            console.error(`completeToBlob.compile ERROR`, { err });
            throw err;
        }
    };

    const completeToDataUrl = async () => {
        const videoBlob = await completeToBlob();
        console.log(`completeToDownloadFile videoBlob ready`, { videoBlob });

        return URL.createObjectURL(videoBlob);
    };

    const completeToDownloadFile = async (filename: string) => {
        const dataUrl = await completeToDataUrl();
        console.log(`completeToDownloadFile dataUrl ready`, { dataUrl });

        const link = document.createElement(`a`);
        link.download = filename;
        link.href = dataUrl;
        document.body.append(link);
        link.click();
        link.remove();

        console.log(`completeToDownloadFile done`, { link, dataUrl });
    };


    const addFrame = async (canvas: HTMLCanvasElement) => {

        return await new Promise<void>((resolve, reject) => {
            const cvs = workingCanvas;
            const ctx = workingContext;
            if (!cvs || !ctx || !blobs || !_settings) { throw new Error(`Recorder has not started`); }

            try {
                mode = `processingFrame`;

                ctx.drawImage(canvas, 0, 0, _settings.width, _settings.height);
                cvs.toBlob(b => {
                    if (!ctx || !blobs || !_settings) { throw new Error(`Recorder has not started`); }

                    b && blobs?.push(b);

                    // Finally update time
                    const timeMsPerFrame = 1000 / _settings.framesPerSecond;
                    timeMs += timeMsPerFrame;
                    mode = `waitingForFrame`;
                    resolve();
                }, `image/webp`, _settings.quality);


            } catch (err) {
                console.error(`addFrame ERROR`, { err });
                mode = `waitingForFrame`;
                reject(err);
            }
        });
    };

    return {
        start,
        isRecording: () => isRecording,
        isWaitingForFrame: () => mode === `waitingForFrame`,
        isProcessingVideo: () => mode === `processingVideo`,
        getRecorder: () => {
            if (!isRecording) { throw new Error(`Recorder is not recording`); }

            return {
                addFrame,
                completeToBlob,
                completeToDownloadFile,
                completeToDataUrl,
                settings: _settings,
            };
        },
        timeProvider,
    };
};

export type CanvasVideoRecorder = ReturnType<typeof createRecorder>;

export const CanvasVideoRecorderControl = (props: { recorder: CanvasVideoRecorder }) => {

    const [mode, setMode] = useState(`ready` as 'ready' | 'recording' | 'stopped');

    const startRecording = () => {
        setMode(`recording`);
        doWork(async (stopIfObsolete) => {
            await props.recorder.start({
                framesPerSecond: 30,
                width: 600,
                height: 300,
                quality: 0.95,
                // quality: 0.95,
                // width: 1920,
                // height: 1080,
            });
        });
    };

    const { loading, error, doWork } = useAutoLoadingError();

    const stopRecording = () => {
        setMode(`stopped`);
        doWork(async (stopIfObsolete) => {
            await props.recorder.getRecorder().completeToDownloadFile(`video.mp4`);
        });
    };

    return (
        <>
            <div>
                {error && (
                    <div style={{ background: `#88888888` }}><span>ERROR! ‼</span></div>
                )}
                {loading && (
                    <div style={{ background: `#88888888` }}><span>Loading 🔄</span></div>
                )}
                {mode === `ready` && (
                    <div onClick={startRecording} style={{ background: `#88888888` }}><span>Record ⏺</span></div>
                )}
                {mode === `recording` && (
                    <div onClick={stopRecording} style={{ background: `#88888888` }}><span>Stop ⏹</span></div>
                )}
            </div>
        </>
    );
};
