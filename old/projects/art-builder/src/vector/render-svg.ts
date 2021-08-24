import fsRaw from 'fs';
import path from 'path';
import canvas from 'canvas';
import sharp from 'sharp';
import { createRandomGenerator } from 'art/rando';
import { transformSvgWithTraits } from './transform-svg-with-traits';
import { js2xml, xml2js } from 'xml-js';
import { RgbHex, SvgDoc } from './inkscape-svg-types';
import { colorFormat } from 'art/color-format';

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

export const renderSvgPixelArt = async (input: Buffer, output: NodeJS.WritableStream, seed: string) => {
    console.log(`# renderSvgPixelArt`, {});

    const BASE_SIZE = 32;
    const BASE_DPI = 96;

    const SIZE = 32;
    const SCALE = 7;
    const CANVAS_SCALE = SCALE;
    const OUT_SCALE = 8;
    const K_H_RANGE = 4 / 256 * 360;
    const K_S_RANGE = 4 / 256 * 100;
    const K_L_RANGE = 16 / 256 * 100;
    const JITTER = 16;
    const { random } = createRandomGenerator(`${seed}-pixel-jitter`);

    const imageBuffer = await sharp(input, { density: BASE_DPI * SCALE * SIZE / BASE_SIZE })
        .resize({ width: SIZE * SCALE, height: SIZE * SCALE, kernel: `nearest`, withoutEnlargement: true })
        .png()
        .toBuffer();

    // .resize(SIZE, SIZE, { kernel: `nearest`, withoutEnlargement: true })
    // .png({ dither: 0 })
    // .toFile(`${x}.png`);

    const cvs = canvas.createCanvas(SIZE * CANVAS_SCALE, SIZE * CANVAS_SCALE);
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
    // ctx.drawImage(svgImage, 0, 0, SIZE, SIZE);
    const largeImage = await canvas.loadImage(imageBuffer);
    ctx.drawImage(largeImage, 0, 0, SIZE * CANVAS_SCALE, SIZE * CANVAS_SCALE);


    const cvs2 = canvas.createCanvas(SIZE * OUT_SCALE, SIZE * OUT_SCALE);
    const ctx2 = cvs2.getContext(`2d`);
    ctx2.antialias = `none`;
    ctx2.imageSmoothingEnabled = false;

    const imageData = ctx.getImageData(0, 0, SIZE * CANVAS_SCALE, SIZE * CANVAS_SCALE);
    const imageData2 = ctx2.getImageData(0, 0, SIZE * OUT_SCALE, SIZE * OUT_SCALE);

    // Pixelize data
    for (let i = 0; i < imageData.width / SCALE; i++){
        for (let j = 0; j < imageData.height / SCALE; j++){

            type RGB = { r: number, g: number, b: number, a?: number };
            const getColorKey = (rgb: RGB) => {
                return colorFormat.rgbToRgbHex(rgb);
            };
            const getColorFromColorKey = (rgbKey: RgbHex): RGB => {
                return colorFormat.rgbHexToRgb(rgbKey);
            };

            const getColorKeyQuantized = ({ r, g, b }: RGB) => {
                const hslRaw = colorFormat.rgbToHsl({ r, g, b });
                const hsl = {
                    h: Math.round(hslRaw.h / K_H_RANGE) * K_H_RANGE,
                    s: Math.round(hslRaw.s / K_S_RANGE) * K_S_RANGE,
                    l: Math.round(hslRaw.l / K_L_RANGE) * K_L_RANGE,
                };
                const rgb = colorFormat.hslToRgb(hsl);

                return getColorKey(rgb);
            };

            const kMeansPixels = new Map<RgbHex, RGB[]>();
            let alphaPixelCount = 0;
            let nonAlphaPixelCount = 0;

            const totalPixelValue = {
                r: 0,
                g: 0,
                b: 0,
                a: 0,
            };

            const iCenter = (
                (i * SCALE + Math.floor(SCALE / 2))
                + (j * SCALE + Math.floor(SCALE / 2))
                * imageData.width) * 4;
            const centerPixelValue = {
                r: imageData.data[iCenter + 0],
                g: imageData.data[iCenter + 1],
                b: imageData.data[iCenter + 2],
                a: imageData.data[iCenter + 3],
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
                        alphaPixelCount++;
                    } else {
                        imageData.data[iData + 3] = 255;
                        nonAlphaPixelCount++;

                        // Posterize channels

                        const key = getColorKeyQuantized({ r, g, b });
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

            // Alpha should be scored against all other colors
            const mostPixel = [...kMeansPixels.entries()].sort((a, b) => -(a[1].length - b[1].length))[0];
            const isAlpha = alphaPixelCount > nonAlphaPixelCount;

            // if (!isAlpha && i % 4 === 0 && j % 4 === 0){
            //     console.log(`renderSvgPixelArt sample`, {
            //         pixelCounts: kMeansPixels,
            //         isAlpha,
            //         mostPixel,
            //         centerPixelValueHex: getColorKey(centerPixelValue),
            //         avePixelValueHex: getColorKey(avePixelValue),
            //         centerPixelValue,
            //         avePixelValue,
            //     });
            // }

            const getOutputColor = () => {

                const kValue = getColorFromColorKey(mostPixel[0]);
                // imageData2.data[iDestData + 0] = kValue.r;
                // imageData2.data[iDestData + 1] = kValue.g;
                // imageData2.data[iDestData + 2] = kValue.b;
                // imageData2.data[iDestData + 3] = 255;

                const valuesSorted = mostPixel[1].map(x => ({
                    x,
                    order: 0
                        + x.r - kValue.r
                        + x.g - kValue.g
                        + x.b - kValue.b
                    ,
                })).sort((a, b) => a.order - b.order);
                const midValue = valuesSorted[Math.floor(mostPixel[1].length / 2)].x;

                // Add Random Additive Jitter
                // const pOutput = {
                //     r: Math.max(0, Math.min(255, Math.floor(midValue.r + JITTER * (0.5 - random())))),
                //     g: Math.max(0, Math.min(255, Math.floor(midValue.g + JITTER * (0.5 - random())))),
                //     b: Math.max(0, Math.min(255, Math.floor(midValue.b + JITTER * (0.5 - random())))),
                // };
                // Add Random Mult Jitter (Brightness)
                const jitterMult = (1 + (JITTER * 1.0 / 256) * (0.5 - random()));
                return {
                    r: Math.max(0, Math.min(255, Math.floor(midValue.r * jitterMult))),
                    g: Math.max(0, Math.min(255, Math.floor(midValue.g * jitterMult))),
                    b: Math.max(0, Math.min(255, Math.floor(midValue.b * jitterMult))),
                };
            };

            const pOutput = isAlpha ? { r: 0, g: 0, b: 0, a: 0 }
                : { ...getOutputColor(), a: 255 };

            for (let i2 = 0; i2 < OUT_SCALE; i2++){
                for (let j2 = 0; j2 < OUT_SCALE; j2++){
                    const iPixel = i * OUT_SCALE + i2;
                    const jPixel = j * OUT_SCALE + j2;
                    const iData = (iPixel + jPixel * imageData2.width) * 4;

                    imageData2.data[iData + 0] = pOutput.r;
                    imageData2.data[iData + 1] = pOutput.g;
                    imageData2.data[iData + 2] = pOutput.b;
                    imageData2.data[iData + 3] = pOutput.a;
                }
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
    //     0, 0, SIZE * CANVASSCALE, SIZE * CANVASSCALE,
    //     0, 0, SIZE, SIZE);


    console.log(`renderSvgPixelArt - Saving png`, {});
    // const outFilePath = x + `.png`;
    // const out = fsRaw.createWriteStream(outFilePath);
    await new Promise<void>((resolve, reject) => {
        const stream = cvs2.createPNGStream({});
        output
            .on(`finish`, () => {
                resolve();
            })
            .on(`error`, () => {
                console.error(`renderSvg - Png Error`, {});
                reject();
            });
        stream.pipe(output);
    });

    console.log(`renderSvgPixelArt - DONE`, { });
};

export const renderSvgWithTraits = async (sourceDir: string, destDir: string, seeds?: string[]) => {
    console.log(`# renderSvgWithTraits`, { sourceDir, destDir, seeds });

    const dirFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    const svgFilePaths = dirFiles
        .filter(x => x.name.endsWith(`.svg`))
        .map(x => normalizeFilePath(path.join(sourceDir, x.name)))
        .sort((a, b) => a.localeCompare(b));


    for (const x of svgFilePaths){
        const svgFileContentRaw = await fs.readFile(x, { encoding: `utf-8` });

        for (const s of seeds ?? [`42`]){
            console.log(`## renderSvgWithTraits - Transforming svg`, { filePath: x, seed: s });

            const svgDoc = xml2js(svgFileContentRaw, { compact: false }) as SvgDoc;
            const result = transformSvgWithTraits(svgDoc, s);
            if (!result){ continue; }
            const t = result.selectedTraits;
            const ifNotDefault = <T extends { traitKey: TTraitKey }, TTraitKey extends string, TDefTraitKey extends TTraitKey>(obj: T, def: TDefTraitKey) => obj.traitKey === def ? `-___` : `-${obj.traitKey.substr(0, 3)}`;
            const summary = `${
                ifNotDefault(t.humanoid, `natural`)}${
                ifNotDefault(t.theme, `normal`)}${
                ifNotDefault(t.effect, `none`)}${
                ifNotDefault(t.headwear, `armyHelmet`)}${
                ifNotDefault(t.weapon, `axe`)}${
                ifNotDefault(t.clothes, `tunic`)}${
                ifNotDefault(t.hair, `short`)}${
                ifNotDefault(t.facehair, `beard`)}${
                ``}`;
            const outFileName = `${s.padStart(8, `_`)}-${summary.toLocaleUpperCase()}`;

            const svgTransformed = js2xml(svgDoc, { spaces: 2, indentAttributes: true });

            console.log(`## renderSvgWithTraits - Rendering svg`, { filePath: x, seed: s });
            const input = Buffer.from(svgTransformed);
            const outFilePath = path.join(destDir, `vector-samples`,
                `${path.basename(x)}-${outFileName}.png`);
            await fs.mkdir(path.dirname(outFilePath), { recursive: true });

            if (fsRaw.existsSync(outFilePath)){
                fsRaw.unlinkSync(outFilePath);
            }
            const output = fsRaw.createWriteStream(outFilePath);
            await renderSvgPixelArt(input, output, s);

            console.log(`## renderSvgWithTraits - Done`, { filePath: x, seed: s });
        }
    }


};