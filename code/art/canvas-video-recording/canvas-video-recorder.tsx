/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAutoLoadingError } from 'utils-react/hooks';
import React, { useState } from 'react';
import { delay } from 'utils/delay';
import { TimeProvider } from '../time-provider';

export const createRecorder = () => {

    let _settings: null | { framesPerSecond: number, quality?: number, width: number, height: number } = null;

    let timeMsLost = 0;
    let timeMs = Date.now();
    let isRecording = false;
    let mode = `starting` as 'starting' | `waitingForFrame` | `processingFrame` | 'processingVideo';
    let stream: null | MediaStream = null;
    let recorder: null | MediaRecorder = null;
    let workingCanvas = null as null | HTMLCanvasElement;
    let workingContext = null as null | CanvasRenderingContext2D;
    let blobs = null as null | Blob[];
    let dataAvailableCallback = () => { };

    const timeProvider: TimeProvider = {
        now: () => isRecording ? timeMs : (Date.now() - timeMsLost),
        isPaused: () => isRecording ? mode !== `waitingForFrame` : false,
    };

    const start = async (settings: NonNullable<typeof _settings>) => {

        try {
            if (isRecording || mode !== `starting`) { return; }

            _settings = settings;
            isRecording = true;

            // Copy the canvas
            workingCanvas = document.createElement(`canvas`);
            workingCanvas.width = _settings.width;
            workingCanvas.height = _settings.height;
            workingCanvas.style.background = `#00FF00`;
            document.body.append(workingCanvas);

            await delay(100);
            workingContext = workingCanvas.getContext(`2d`);

            stream = (workingCanvas as unknown as { captureStream: (frameRate?: number) => MediaStream }).captureStream(_settings.framesPerSecond);

            recorder = new MediaRecorder(stream, {
                // audioBitsPerSecond: 128000,
                // // videoBitsPerSecond: 2500000,
                videoBitsPerSecond: 25 * 1000 * 1000,
                // mimeType: `video/mp4`,
                mimeType: `video/webm;codecs=h264`,
                // mimeType: `video/webm`,
            });
            console.log(`Created MediaRecorder`, { recorder, stream, workingCanvas });

            blobs = [];
            const b = blobs;
            recorder.addEventListener(`dataavailable`, (e) => {
                if (e.data.size > 0) {
                    console.log(`dataavailable`, { data: e.data });
                    b.push(e.data);
                }

                dataAvailableCallback();
            });

            await delay(100);

            // recorder.addEventListener(`dataavailable`, finishCapturing);
            // recorder.addEventListener(`stop`, function (e) {
            //     video.addEventListener(`canplay`, video.play);
            //     video.src = URL.createObjectURL(new Blob(blobs, { type: `video/webm; codecs=vp9` }));
            // });
            // startCapturing();
            recorder.start();

            timeMs = timeProvider.now();
            mode = `waitingForFrame`;
        } catch (err) {
            console.error(`completeToBlob.compile ERROR`, { err });
        }
    };

    const completeToBlob = async () => {
        if (!recorder) { throw new Error(`Recorder has not started`); }
        const w = recorder;
        isRecording = false;
        timeMsLost = Date.now() - timeMs;
        mode = `processingVideo`;

        return await new Promise<Blob>((resolve, reject) => {
            setTimeout(() => {
                try {
                    console.log(`completeToBlob.compile started`);
                    // const webMBlob = w.getTracks()[0];
                    w.addEventListener(`stop`, (e) => {
                        // video.addEventListener(`canplay`, video.play);
                        // video.src = URL.createObjectURL(new Blob(blobs, { type: `video/webm; codecs=vp9` }));

                        if (!blobs) {
                            throw new Error(`No blobs!`);
                        }

                        const webMBlob = new Blob(blobs, { type: `video/webm` });
                        // const webMBlob = new Blob(blobs, { type: `video/webm; codecs=vp9` });
                        console.log(`completeToBlob.compile done`, { webMBlob });
                        resolve(webMBlob);
                    });
                    w.stop();

                } catch (err) {
                    console.error(`completeToBlob.compile ERROR`, { err });
                    reject(err);
                }
            });
        });
    };

    const completeToDataUrl = async () => {
        const webMBlob = await completeToBlob();
        console.log(`completeToDownloadFile webMBlob ready`, { webMBlob });

        return URL.createObjectURL(webMBlob);
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
            if (!recorder || !_settings) { throw new Error(`Recorder has not started`); }

            try {
                mode = `processingFrame`;

                const clone = workingCanvas;
                const context = workingContext;

                if (!context) {
                    throw new Error(`Could not get context`);
                }
                if (!stream) {
                    throw new Error(`Could not get stream`);
                }

                console.log(`drawImage START`, { canvas, clone });

                context.drawImage(canvas, 0, 0, _settings.width, _settings.height);
                // context.drawImage(canvas, 0, 0, _settings.width, _settings.height, 0, 0, canvas.width, canvas.height);
                console.log(`drawImage DONE`, { canvas, clone });


                dataAvailableCallback = () => {
                    if (!recorder || !_settings) { throw new Error(`Recorder has not started`); }

                    console.log(`dataAvailableCallback`);
                    // Add clone as frame
                    // const frame = clone.toDataURL(`image/webp`, 1);
                    // writer.add(frame);

                    // Finally update time
                    const timeMsPerFrame = 1000 / _settings.framesPerSecond;
                    timeMs += timeMsPerFrame;
                    mode = `waitingForFrame`;

                    resolve();
                };
                recorder.requestData();

            } catch (err) {
                console.error(`addFrame ERROR`, { err });
                mode = `waitingForFrame`;
                reject();
            }
        });
    };

    return {
        start,
        isRecording: () => isRecording,
        isWaitingForFrame: () => mode === `waitingForFrame`,
        isProcessingVideo: () => mode === `processingVideo`,
        getRecorder: () => {
            if (!isRecording || !recorder) { throw new Error(`Recorder is not recording`); }

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
                framesPerSecond: 15,
                // width: 1280,
                // height: 720,
                quality: 1,
                width: 1920,
                height: 1080,
            });
        });
    };

    const { loading, error, doWork } = useAutoLoadingError();

    const stopRecording = () => {
        setMode(`stopped`);
        doWork(async (stopIfObsolete) => {
            await props.recorder.getRecorder().completeToDownloadFile(`video.download`);
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
