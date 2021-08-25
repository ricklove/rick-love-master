import fs from 'fs';
import savePixels from 'save-pixels';
import getPixels from 'get-pixels';
import ndarray from 'ndarray';
import { GL, ImageDataGL, readPixels } from './utils';

export const saveImageGl = async (filePath: string, gl: GL, width: number, height: number, type: 'png' | 'gif') => {
    return await saveImage(filePath, readPixels(gl, width, height), type);
};
export const saveImage = async (filePath: string, imageData: ImageDataGL, type: 'png' | 'gif') => {
    return await new Promise((resolve, reject) => {
        savePixels(ndarray(imageData.data, [imageData.width, imageData.height]), type)
            .pipe(fs.createWriteStream(filePath))
            .on(`error`, reject)
            .on(`finish`, resolve);
    });
};

export const loadImageFileIntoTexture = async (filePath: string, gl: GL) => {
    const imageData = await loadImage(filePath);

    const texture = gl.createTexture();
    if (!texture){ throw new Error(`Failed to createTexture`);}

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
        imageData.width, imageData.height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, imageData.data);

    // Disable minmap
    // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Prevents s-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // Prevents t-coordinate wrapping (repeating).
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
};

export const loadImage = async (filePath: string): Promise<ImageDataGL> => {
    return await new Promise<ImageDataGL>((resolve, reject) => {
        getPixels(filePath, (err, pixels) => {
            if (err){ reject(err);}
            resolve({
                data: Uint8Array.from(pixels.data),
                width: pixels.shape[0],
                height: pixels.shape[1],
            });
        });
    });
};
