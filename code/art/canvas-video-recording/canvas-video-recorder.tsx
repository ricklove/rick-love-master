/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAutoLoadingError } from 'utils-react/hooks';
import React, { useState } from 'react';
import { TimeProvider } from '../time-provider';

export const createRecorder = () => {

    let _settings: null | { framesPerSecond: number, quality?: number, width: number, height: number } = null;

    let timeMsLost = 0;
    let timeMs = Date.now();
    let isRecording = false;
    let mode = `waitingForFrame` as `waitingForFrame` | `processingFrame` | 'processingVideo';
    let stream: null | MediaStream = null;
    let recorder: null | MediaRecorder = null;
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

        stream = (workingCanvas as unknown as { captureStream: (frameRate?: number) => MediaStream }).captureStream(15);
        recorder = new MediaRecorder(stream);

        blobs = [];
        const b = blobs;
        recorder.addEventListener(`dataavailable`, (e) => {
            console.log(`dataavailable`, { data: e.data });
            b.push(e.data);
        });

        // recorder.addEventListener(`dataavailable`, finishCapturing);
        // recorder.addEventListener(`stop`, function (e) {
        //     video.addEventListener(`canplay`, video.play);
        //     video.src = URL.createObjectURL(new Blob(blobs, { type: `video/webm; codecs=vp9` }));
        // });
        // startCapturing();
        recorder.start();

        timeMs = timeProvider.now();
        isRecording = true;
        mode = `waitingForFrame`;
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

                        const webMBlob = new Blob(blobs, { type: `video/webm; codecs=vp9` });
                        console.log(`completeToBlob.compile done`, { webMBlob });
                        resolve(webMBlob);
                    });

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

            context.drawImage(canvas, 0, 0, _settings.width, _settings.height);
            // stream.getTracks()[0].
            // recorder.requestData();

            // Add clone as frame
            // const frame = clone.toDataURL(`image/webp`, 1);
            // writer.add(frame);

            // Finally update time
            const timeMsPerFrame = 1000 / _settings.framesPerSecond;
            timeMs += timeMsPerFrame;
            mode = `waitingForFrame`;
        } catch (err) {
            console.error(`addFrame ERROR`, { err });
            mode = `waitingForFrame`;
        }
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
        props.recorder.start({
            framesPerSecond: 15,
            width: 128,
            height: 128,
            // width: 1920,
            // height: 1080,
        });
        setMode(`recording`);
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
