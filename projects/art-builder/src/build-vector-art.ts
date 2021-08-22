import fsRaw from 'fs';
import { injectSvgComponents } from './vector/inject-svg-components';
import { renderSvgWithTraits } from './vector/render-svg';

const fs = fsRaw.promises;

export const buildVectorArt = async (svgDirectory: string, outDir: string, options?: { skipExtraction?: boolean }) => {

    try {
        await injectSvgComponents(svgDirectory);
        await renderSvgWithTraits(svgDirectory, outDir, [...new Array(256)].map((x, i) => `${i}`));
        // await renderSvgWithTraits(svgDirectory, outDir, [`92`]);
    } catch (err){
        console.error(`FAIL buildVectorArt`, err);
    }
    console.log(`DONE`);
    process.exit();
};

