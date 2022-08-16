import fs from 'fs';
import savePixels from 'save-pixels';
import getPixels from 'get-pixels';
import ndarray from 'ndarray';

// export type ImageDataGL = {
//     data: Uint8Array;
//     width: number;
//     height: number;
// };

export const saveImageFile = async (filePath: string, imageData: ImageData, type: 'png' | 'gif') => {
    return await new Promise((resolve, reject) => {
        const pixels = ndarray(imageData.data, [imageData.width, imageData.height, 4], [4, 4 * imageData.width, 1]);
        // console.log(`saveImageFile`, { shape: pixels.shape, stride: pixels.stride });

        savePixels(pixels, type)
            .pipe(fs.createWriteStream(filePath))
            .on(`error`, reject)
            .on(`finish`, resolve);
    });
};

export const loadImageFile = async (filePath: string): Promise<ImageData> => {
    return await new Promise<ImageData>((resolve, reject) => {
        getPixels(filePath, (err, pixels) => {
            if (err){ reject(err);}

            //console.log(`loadImageFile`, { shape: pixels.shape, stride: pixels.stride });
            if (pixels.shape[2] !== 4){
                console.error(`loadImageFile image does not seem to be RGBA`, { filePath });
            }

            resolve({
                data: new Uint8ClampedArray(pixels.data),
                width: pixels.shape[0],
                height: pixels.shape[1],
            });
        });
    });
};
