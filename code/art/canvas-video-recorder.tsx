/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAutoLoadingError } from 'utils-react/hooks';
import React, { useEffect, useState, useRef } from 'react';
import WebMWriter from 'webm-writer';
import { TimeProvider } from './time-provider';

export const createRecorder = () => {

    let timeMsLost = 0;
    let timeMs = Date.now();
    let isRecording = false;
    let isWaitingForFrame = false;
    let writer: null | WebMWriter = null;
    let _settings: null | { framesPerSecond: number, width: number, height: number } = null;

    const timeProvider: TimeProvider = {
        now: () => isRecording ? timeMs : (Date.now() - timeMsLost),
        isPaused: () => isRecording ? isWaitingForFrame : false,
    };

    const start = (settings: NonNullable<typeof _settings>) => {
        if (isRecording) { return; }

        _settings = settings;
        writer = new WebMWriter({
            quality: 1,
            frameRate: _settings.framesPerSecond,
        });

        timeMs = timeProvider.now();
        isRecording = true;
        isWaitingForFrame = true;
    };

    const completeToBlob = async () => {
        if (!writer) { throw new Error(`Recorder has not started`); }

        const webMBlob = await writer.complete();

        timeMsLost = Date.now() - timeMs;
        isRecording = false;

        return webMBlob;
    };

    const completeToDataUrl = async () => {
        const webMBlob = await completeToBlob();
        return URL.createObjectURL(webMBlob);
    };

    const completeToDownloadFile = async (filename: string) => {
        const dataUrl = await completeToDataUrl();

        const link = document.createElement(`a`);
        link.download = filename;
        link.href = dataUrl;
        document.body.append(link);
        link.click();
        link.remove();
    };

    const addFrame = async (canvas: HTMLCanvasElement) => {
        if (!writer || !_settings) { throw new Error(`Recorder has not started`); }

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
        writer.addFrame(clone);

        // Finally update time
        const timeMsPerFrame = 1000 / _settings.framesPerSecond;
        timeMs += timeMsPerFrame;
        isWaitingForFrame = false;
    };

    return {
        start,
        isRecording: () => isRecording,
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
            framesPerSecond: 60,
            width: 1920,
            height: 1080,
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
