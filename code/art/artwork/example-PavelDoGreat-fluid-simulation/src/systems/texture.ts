import { FrameBufferFactory, FrameBufferObject } from './frame-buffer';
import { clamp01 } from '../utils';
import { WebGlSystem } from './webgl';

export const createTextureUtils = ({ gl, ext }: WebGlSystem, { createFBO }: FrameBufferFactory) => {

    function captureScreenshot(render: (target: FrameBufferObject) => void, { resolution }: { resolution: number }) {
        const res = getResolution(resolution);
        const target = createFBO(res.width, res.height, ext.formatRGBA.internalFormat, ext.formatRGBA.format, ext.halfFloatTexType, gl.NEAREST);
        render(target);

        const texture32 = framebufferToTexture(target);
        const texture = normalizeTexture(texture32, target.width, target.height);

        const captureCanvas = textureToCanvas(texture, target.width, target.height);
        const datauri = captureCanvas.toDataURL();
        downloadURI(`fluid.png`, datauri);
        URL.revokeObjectURL(datauri);
    }

    function downloadURI(filename: string, uri: string) {
        const link = document.createElement(`a`);
        link.download = filename;
        link.href = uri;
        document.body.append(link);
        link.click();
        link.remove();
    }

    function getResolution(resolution: number) {
        let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        if (aspectRatio < 1)
            aspectRatio = 1 / aspectRatio;

        const min = Math.round(resolution);
        const max = Math.round(resolution * aspectRatio);

        if (gl.drawingBufferWidth > gl.drawingBufferHeight)
            return { width: max, height: min };
        return { width: min, height: max };
    }

    function framebufferToTexture(target: FrameBufferObject) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
        const length = target.width * target.height * 4;
        const texture = new Float32Array(length);
        gl.readPixels(0, 0, target.width, target.height, gl.RGBA, gl.FLOAT, texture);
        return texture;
    }

    function normalizeTexture(texture: Float32Array, width: number, height: number) {
        const result = new Uint8Array(texture.length);
        let id = 0;
        for (let i = height - 1; i >= 0; i--) {
            for (let j = 0; j < width; j++) {
                const nid = i * width * 4 + j * 4;
                result[nid + 0] = clamp01(texture[id + 0]) * 255;
                result[nid + 1] = clamp01(texture[id + 1]) * 255;
                result[nid + 2] = clamp01(texture[id + 2]) * 255;
                result[nid + 3] = clamp01(texture[id + 3]) * 255;
                id += 4;
            }
        }
        return result;
    }

    function textureToCanvas(texture: Uint8Array, width: number, height: number) {
        const captureCanvas = document.createElement(`canvas`);
        const ctx = captureCanvas.getContext(`2d`);
        if (!ctx) { throw new Error(`Could not get canvas 2d context`); }

        captureCanvas.width = width;
        captureCanvas.height = height;

        const imageData = ctx.createImageData(width, height);
        imageData.data.set(texture);
        ctx.putImageData(imageData, 0, 0);

        return captureCanvas;
    }

    return {
        captureScreenshot,
        getResolution,
        // framebufferToTexture,
        // normalizeTexture,
        // textureToCanvas,
    };
};
