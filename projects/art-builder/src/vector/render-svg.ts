import fsRaw from 'fs';
import path from 'path';
import canvas from 'canvas';
import sharp from 'sharp';

const fs = fsRaw.promises;
const normalizeFilePath = (filePath: string) => path.resolve(filePath).replace(/\\/g, `/`);

// type SvgExportDataFile = {
//     input: [
//         inputfile: string,
//         format: 'png',
//         /** 1-100 % */
//         quality: number,
//         size:`${number}:${number}`
//     ];
//     output: [outputFile:string];
// }[];
// const svgexport = svgexportRaw as {
//     render: (datafile: SvgExportDataFile, callback: () => void) => void;
// };

export const renderSvg = async (sourceDir: string, destDir: string) => {
    console.log(`# Render Svg `, { sourceDir, destDir });

    const dirFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    const svgFilePaths = dirFiles
        .filter(x => x.name.endsWith(`.svg`))
        .map(x => normalizeFilePath(path.join(sourceDir, x.name)))
        .sort((a, b) => a.localeCompare(b));


    await Promise.all(svgFilePaths.map(async (x) => {
        console.log(`renderSvg - render svg`, { x });

        const SCALE = 4;
        const CANVASSCALE = 1;
        const imageBuffer = await sharp(x, { density: 96 * SCALE })
            .resize({ width: 32 * SCALE, height: 32 * SCALE, kernel: `nearest`, withoutEnlargement: true })
            .png()
            .toBuffer();

        // .resize(32, 32, { kernel: `nearest`, withoutEnlargement: true })
        // .png({ dither: 0 })
        // .toFile(`${x}.png`);

        const cvs = canvas.createCanvas(32 * CANVASSCALE, 32 * CANVASSCALE);
        const ctx = cvs.getContext(`2d`);
        ctx.antialias = `none`;
        ctx.imageSmoothingEnabled = false;

        // console.error(`renderSvg - Loading svg`, { x });
        // const svgImage = new canvas.Image();
        // svgImage.src = x;
        // await new Promise<void>((resolve, reject) => {
        //     svgImage.onload = () => {
        //         resolve();
        //     };
        //     svgImage.onerror = () => {
        //         console.error(`renderSvg - Image failed to load`, { x });
        //         reject();
        //     };
        // });

        // console.log(`renderSvg - Drawing svg`, { x });
        // ctx.drawImage(svgImage, 0, 0, 32, 32);
        const largeImage = await canvas.loadImage(imageBuffer);
        ctx.drawImage(largeImage, 0, 0, 32 * CANVASSCALE, 32 * CANVASSCALE);

        const imageData = ctx.getImageData(0, 0, 32 * CANVASSCALE, 32 * CANVASSCALE);

        // Pixelize data
        for (let i = 0; i < imageData.width; i += SCALE){
            for (let j = 0; j < imageData.height; j += SCALE){

                const pixelCounts = new Map<number, number>();

                for (let i2 = 0; i2 < SCALE; i2++){
                    for (let j2 = 0; j2 < SCALE; j2++){
                        const iPixel = i + i2;
                        const jPixel = j + j2;
                        const iData = (iPixel + jPixel * imageData.width) * 4;
                        const r = imageData.data[iData + 0];
                        const g = imageData.data[iData + 1];
                        const b = imageData.data[iData + 2];
                        const a = imageData.data[iData + 3];

                        // Alpha threshold
                        if (a < 128){
                            imageData.data[iData + 3] = 0;
                        } else {
                            imageData.data[iData + 3] = 255;
                        }

                    }
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);

        console.log(`renderSvg - Saving png`, { x });
        const outFilePath = x + `.png`;
        const out = fsRaw.createWriteStream(outFilePath);
        const stream = cvs.createPNGStream();
        stream.pipe(out);
        await new Promise<void>((resolve, reject) => {
            out.on(`finish`, () => resolve())
                .on(`error`, () => {
                    console.error(`renderSvg - Png file failed to save`, { outFilePath, sourceFilePath: x });
                    reject();
                });
        });

        console.log(`renderSvg - DONE`, { x });

    }));

};
