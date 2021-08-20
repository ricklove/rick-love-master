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
        const CANVASSCALE = 4;
        const K_RANGE = 8;
        const ALPHA_SCORE_MULT = 0.8;

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


        const cvs2 = canvas.createCanvas(32, 32);
        const ctx2 = cvs2.getContext(`2d`);
        ctx2.antialias = `none`;
        ctx2.imageSmoothingEnabled = false;

        const imageData = ctx.getImageData(0, 0, 32 * CANVASSCALE, 32 * CANVASSCALE);
        const imageData2 = ctx2.getImageData(0, 0, 32, 32);

        // Pixelize data
        for (let i = 0; i < imageData.width / SCALE; i++){
            for (let j = 0; j < imageData.height / SCALE; j++){

                type RGB = { r: number, g: number, b: number, a?: number };
                const getColorKey = ({ r, g, b }: RGB) => {
                    return `${r.toString(16).padStart(2, `0`)}${g.toString(16).padStart(2, `0`)}${b.toString(16).padStart(2, `0`)}`;
                };
                const getColorFromColorKey = (rgbKey: string): RGB => {
                    return {
                        r: parseInt(rgbKey.substr(0, 2), 16),
                        g: parseInt(rgbKey.substr(2, 2), 16),
                        b: parseInt(rgbKey.substr(4, 2), 16),
                    };
                };
                const kMeansPixels = new Map<string, RGB[]>();

                const totalPixelValue = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0,
                };

                const centerPixelValue = {
                    r: imageData.data[((i * SCALE + Math.floor(SCALE / 2)) + (j * SCALE + Math.floor(SCALE / 2)) * imageData.width) * 4 + 0],
                    g: imageData.data[((i * SCALE + Math.floor(SCALE / 2)) + (j * SCALE + Math.floor(SCALE / 2)) * imageData.width) * 4 + 1],
                    b: imageData.data[((i * SCALE + Math.floor(SCALE / 2)) + (j * SCALE + Math.floor(SCALE / 2)) * imageData.width) * 4 + 2],
                    a: imageData.data[((i * SCALE + Math.floor(SCALE / 2)) + (j * SCALE + Math.floor(SCALE / 2)) * imageData.width) * 4 + 3],
                };

                for (let i2 = 0; i2 < SCALE; i2++){
                    for (let j2 = 0; j2 < SCALE; j2++){
                        const iPixel = i * SCALE + i2;
                        const jPixel = j * SCALE + j2;
                        const iData = (iPixel + jPixel * imageData.width) * 4;
                        const r = imageData.data[iData + 0];
                        const g = imageData.data[iData + 1];
                        const b = imageData.data[iData + 2];
                        const a = imageData.data[iData + 3];

                        // totalPixelValue.r += r;
                        // totalPixelValue.g += g;
                        // totalPixelValue.b += b;
                        // totalPixelValue.a += a;


                        // Alpha threshold
                        if (a < 128){
                            imageData.data[iData + 3] = 0;
                            if (!kMeansPixels.has(``)){
                                kMeansPixels.set(``, []);
                            }
                            kMeansPixels.get(``)?.push({ r: 0, g: 0, b: 0, a: 0 });
                        } else {
                            imageData.data[iData + 3] = 255;

                            // Posterize channels
                            const rgb = {
                                r: Math.round(r / K_RANGE) * K_RANGE,
                                g: Math.round(g / K_RANGE) * K_RANGE,
                                b: Math.round(b / K_RANGE) * K_RANGE,
                            };

                            const key = getColorKey(rgb);
                            if (!kMeansPixels.has(key)){
                                kMeansPixels.set(key, []);
                            }
                            kMeansPixels.get(key)?.push({ r, g, b });

                            totalPixelValue.r += r;
                            totalPixelValue.g += g;
                            totalPixelValue.b += b;
                            totalPixelValue.a += 255;
                        }
                    }
                }

                // Average pixel value
                // // const totalPixelValue = [...pixelCounts.entries()].reduce((out, p) => {
                // //     out.r += p[1] * (p[0] >> 16) % 256;
                // //     out.g += p[1] * (p[0] >> 8) % 256;
                // //     out.b += p[1] * (p[0] >> 0) % 256;
                // //     out.a += p[1] * (p[0] > 0 ? 255 : 0);
                // //     return out;
                // // }, { r: 0, g: 0, b: 0, a: 0 });
                const avePixelValue = {
                    r: Math.floor(totalPixelValue.r / (SCALE * SCALE)),
                    g: Math.floor(totalPixelValue.g / (SCALE * SCALE)),
                    b: Math.floor(totalPixelValue.b / (SCALE * SCALE)),
                    a: Math.floor(totalPixelValue.a / (SCALE * SCALE)),
                };
                // // const iDestData = (i + j * imageData2.width) * 4;
                // // imageData2.data[iDestData + 0] = avePixelValue.r;
                // // imageData2.data[iDestData + 1] = avePixelValue.g;
                // // imageData2.data[iDestData + 2] = avePixelValue.b;
                // // imageData2.data[iDestData + 3] = avePixelValue.a > 128 ? 255 : 0;

                // // Center pixel value
                // const iDestData = (i + j * imageData2.width) * 4;
                // imageData2.data[iDestData + 0] = centerPixelValue.r;
                // imageData2.data[iDestData + 1] = centerPixelValue.g;
                // imageData2.data[iDestData + 2] = centerPixelValue.b;
                // imageData2.data[iDestData + 3] = centerPixelValue.a > 128 ? 255 : 0;

                // Most common pixel value

                // Discount alpha
                const alphaPixels = kMeansPixels.get(``);
                if (alphaPixels){
                    alphaPixels.splice(Math.floor(alphaPixels.length * ALPHA_SCORE_MULT));
                }

                const maxPixel = [...kMeansPixels.entries()].sort((a, b) => -(a[1].length - b[1].length))[0];

                if (i % 4 === 0 && j % 4 === 0){
                    console.log(`maxPixelValue`, {
                        pixelCounts: kMeansPixels,
                        maxPixel,
                        centerPixelValueHex: getColorKey(centerPixelValue),
                        avePixelValueHex: getColorKey(avePixelValue),
                        centerPixelValue,
                        avePixelValue,
                    });
                }

                const iDestData = (i + j * imageData2.width) * 4;
                if (!maxPixel[0]){
                    imageData2.data[iDestData + 0] = 0;
                    imageData2.data[iDestData + 1] = 0;
                    imageData2.data[iDestData + 2] = 0;
                    imageData2.data[iDestData + 3] = 0;
                } else {
                    const kValue = getColorFromColorKey(maxPixel[0]);
                    // imageData2.data[iDestData + 0] = kValue.r;
                    // imageData2.data[iDestData + 1] = kValue.g;
                    // imageData2.data[iDestData + 2] = kValue.b;
                    // imageData2.data[iDestData + 3] = 255;

                    const valuesSorted = maxPixel[1].map(x => ({
                        x,
                        order: 0
                            + x.r - kValue.r
                            + x.g - kValue.g
                            + x.b - kValue.b
                        ,
                    })).sort((a, b) => a.order - b.order);
                    const midValue = valuesSorted[Math.floor(maxPixel[1].length / 2)].x;

                    imageData2.data[iDestData + 0] = midValue.r;
                    imageData2.data[iDestData + 1] = midValue.g;
                    imageData2.data[iDestData + 2] = midValue.b;
                    imageData2.data[iDestData + 3] = 255;
                }

                // // // TEST
                // // imageData2.data[iDestData + 0] = 255;
                // // imageData2.data[iDestData + 1] = 0;
                // // imageData2.data[iDestData + 2] = 0;
                // // imageData2.data[iDestData + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0);
        ctx2.putImageData(imageData2, 0, 0);


        // ctx2.antialias = `none`;
        // ctx2.imageSmoothingEnabled = false;
        // ctx2.drawImage(cvs,
        //     0, 0, 32 * CANVASSCALE, 32 * CANVASSCALE,
        //     0, 0, 32, 32);


        console.log(`renderSvg - Saving png`, { x });
        const outFilePath = x + `.png`;
        const out = fsRaw.createWriteStream(outFilePath);
        const stream = cvs2.createPNGStream({});
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
