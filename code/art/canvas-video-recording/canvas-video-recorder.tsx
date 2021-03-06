/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAutoLoadingError } from 'utils-react/hooks';
import React, { useState } from 'react';
import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { delay } from 'utils/delay';
import { TimeProvider } from '../time-provider';

export const createRecorder = () => {

    let _settings: null | { framesPerSecond: number, quality?: number, width: number, height: number } = null;

    let timeMsLost = 0;
    let timeMs = Date.now();
    let mode = `none` as 'none'
        | 'targetPrepareRequested' | 'targetReady'
        | `waitingForFrame` | `processingFrame` | `increasingTime`
        | 'requestedCompleteVideo'
        | 'readyToCompleteVideo'
        | 'completingVideo'
        | 'done';
    const isRecording = () => mode === `waitingForFrame` || mode === `processingFrame` || mode === `increasingTime`;

    let workingCanvas = null as null | HTMLCanvasElement;
    let workingContext = null as null | CanvasRenderingContext2D;
    let blobs = null as null | Blob[];

    const timeProvider: TimeProvider = {
        now: () => isRecording() ? timeMs : (Date.now() - timeMsLost),
        isPaused: () => mode === `processingFrame` || mode === `completingVideo`,
    };

    const requestPrepareTarget = async (settings: NonNullable<typeof _settings>) => {
        if (mode !== `none`) { console.error(`requestPrepareTarget: Wrong mode!`, mode); return; }

        _settings = settings;

        // Get canvas ready
        workingCanvas = document.createElement(`canvas`);
        workingCanvas.width = _settings.width;
        workingCanvas.height = _settings.height;
        document.body.append(workingCanvas);

        workingContext = workingCanvas.getContext(`2d`);

        // wait for target canvas
        mode = `targetPrepareRequested`;
    };

    const setTargetReady = () => {
        if (mode !== `targetPrepareRequested`) { console.error(`setTargetReady: Wrong mode!`, mode); return; }
        mode = `targetReady`;
    };

    const start = async () => {
        if (mode !== `targetReady`) { console.error(`start: Wrong mode!`, mode); return; }

        if (!_settings) { console.error(`prepareCanvas first!`); return; }

        blobs = [];
        timeMs = Date.now() - timeMsLost;
        mode = `waitingForFrame`;
    };

    const beginIncreasingTime = () => {
        if (mode === `requestedCompleteVideo`) {
            mode = `readyToCompleteVideo`;
            return;
        }

        if (!_settings) { console.error(`prepareCanvas first!`); return; }
        const timeMsPerFrame = 1000 / _settings.framesPerSecond;

        setTimeout(() => {
            // Finally update time
            timeMs += timeMsPerFrame;
            mode = `waitingForFrame`;
        }, 0);

        mode = `increasingTime`;
    };

    const completeToBlob = async () => {
        if (!blobs || !_settings) { throw new Error(`Recorder has not started`); }
        console.log(`completeToBlob.compile started`);

        timeMsLost = Date.now() - timeMs;
        mode = `completingVideo`;

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
        if (mode === `waitingForFrame` || mode === `increasingTime`) {
            mode = `readyToCompleteVideo`;
        }

        while (mode === `processingFrame` || mode === `requestedCompleteVideo`) {
            mode = `requestedCompleteVideo`;
            await delay(10);
        }

        if (mode !== `readyToCompleteVideo`) { console.error(`completeToDownloadFile: Wrong mode!`, mode); return; }
        mode = `completingVideo`;

        const dataUrl = await completeToDataUrl();
        console.log(`completeToDownloadFile dataUrl ready`, { dataUrl });

        const link = document.createElement(`a`);
        link.download = filename;
        link.href = dataUrl;
        document.body.append(link);
        link.click();
        link.remove();

        console.log(`completeToDownloadFile done`, { link, dataUrl });

        mode = `done`;
    };


    const addFrame = async (canvas: HTMLCanvasElement) => {
        return await new Promise<void>((resolve, reject) => {
            if (mode !== `waitingForFrame`) { console.error(`addFrame: Wrong mode!`, mode); return; }

            const cvs = workingCanvas;
            const ctx = workingContext;
            if (!cvs || !ctx || !blobs || !_settings) { throw new Error(`Recorder has not started`); }

            try {
                mode = `processingFrame`;

                ctx.drawImage(canvas, 0, 0, _settings.width, _settings.height);
                cvs.toBlob(b => {
                    if (!ctx || !blobs || !_settings) { throw new Error(`Recorder has not started`); }

                    b && blobs?.push(b);

                    beginIncreasingTime();

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
        prepareTarget: requestPrepareTarget,
        getSettings: () => _settings,
        getMode: () => mode,
        setTargetReady,
        start,
        isWaitingForFrame: () => mode === `waitingForFrame`,
        getRecorder: () => {
            if (!isRecording()) { throw new Error(`Recorder is not recording`); }

            return {
                addFrame,
                // completeToBlob,
                // completeToDataUrl,
                completeToDownloadFile,
                settings: _settings,
            };
        },
        timeProvider,
    };
};

export type CanvasVideoRecorder = ReturnType<typeof createRecorder>;

export const CanvasVideoRecorderControl = (props: { recorder: CanvasVideoRecorder, onPrepareTarget: () => void }) => {

    const [mode, setMode] = useState(`prepare` as 'prepare' | 'ready' | 'recording' | 'stopped');

    const prepareTarget = () => {
        doWork(async (stopIfObsolete) => {
            await props.recorder.prepareTarget({
                framesPerSecond: 30,

                // 720p - Looks good on mobile
                width: 1280,
                height: 720,

                // // Blurry on twitter
                // width: 480,
                // height: 270,

                // // Blurry on twitter
                // width: 256,
                // height: 256,

                // width: 507,
                // height: 507,
                quality: 0.95,
                // quality: 0.95,
                // width: 1920,
                // height: 1080,
            });
            stopIfObsolete();
            setMode(`ready`);
            props.onPrepareTarget();
        });
    };

    const startRecording = () => {
        setMode(`recording`);
        doWork(async (stopIfObsolete) => {
            await props.recorder.start();
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
                {mode === `prepare` && (
                    <div onClick={prepareTarget} style={{ background: `#88888888` }}><span>Prepare ⏺</span></div>
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
