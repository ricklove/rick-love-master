/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAutoLoadingError } from 'utils-react/hooks';
import React, { useEffect, useState, useRef } from 'react';
import Whammy from 'whammy';
// import WebMWriter from 'webm-writer';
import { TimeProvider } from './time-provider';

export const createRecorder = () => {

    let timeMsLost = 0;
    let timeMs = Date.now();
    let isRecording = false;
    let mode = `waitingForFrame` as `waitingForFrame` | `processingFrame` | 'processingVideo';
    let writer: null | Whammy.Video = null;
    let _settings: null | { framesPerSecond: number, quality?: number, width: number, height: number } = null;

    const timeProvider: TimeProvider = {
        now: () => isRecording ? timeMs : (Date.now() - timeMsLost),
        isPaused: () => isRecording ? mode === `processingFrame` : false,
    };

    const start = (settings: NonNullable<typeof _settings>) => {
        if (isRecording || mode === `processingVideo`) { return; }

        _settings = settings;
        writer = new Whammy.Video(_settings.framesPerSecond, _settings.quality ?? 1);

        timeMs = timeProvider.now();
        isRecording = true;
        mode = `waitingForFrame`;
    };

    const completeToBlob = async () => {
        if (!writer) { throw new Error(`Recorder has not started`); }
        const w = writer;
        isRecording = false;
        timeMsLost = Date.now() - timeMs;
        mode = `processingVideo`;

        return await new Promise<Blob>((resolve, reject) => {
            setTimeout(() => {
                try {
                    console.log(`completeToBlob.compile started`);
                    const webMBlob = w.compile(false);
                    console.log(`completeToBlob.compile done`, { webMBlob });
                    resolve(webMBlob);
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
        if (!writer || !_settings) { throw new Error(`Recorder has not started`); }

        mode = `processingFrame`;

        // Copy the canvas
        const clone = document.createElement(`canvas`);
        clone.width = _settings.width;
        clone.height = _settings.height;

        const context = clone.getContext(`2d`);
        if (!context) {
            throw new Error(`Could not get context`);
        }

        context.drawImage(canvas, 0, 0, _settings.width, _settings.height);

        // Add clone as frame
        writer.add(clone);

        // Finally update time
        const timeMsPerFrame = 1000 / _settings.framesPerSecond;
        timeMs += timeMsPerFrame;
        mode = `waitingForFrame`;
    };

    return {
        start,
        isRecording: () => isRecording,
        isWaitingForFrame: () => mode === `waitingForFrame`,
        isProcessingVideo: () => mode === `processingVideo`,
        getRecorder: () => {
            if (!isRecording || !writer) { throw new Error(`Recorder is not recording`); }

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
