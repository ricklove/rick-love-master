import fsRaw from 'fs';
import path from 'path';
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
        await sharp(x, { density: 96 * 4 })
            .resize(32, 32, { kernel: `nearest`, withoutEnlargement: true })
            .png({ dither: 0 })
            .toFile(`${x}.png`);

        // await new Promise<void>((resolve, reject) => {
        //     console.log(`renderSvg - render svg`, { x });

        //     svgexport.render([{
        //         input: [x, `png`, 100, `32:32`],
        //         output: [x + `.png`],
        //     }], () => {
        //         resolve();
        //     });
        // });
    }));

};
