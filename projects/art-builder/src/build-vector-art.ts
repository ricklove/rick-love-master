import fsRaw from 'fs';
import { injectSvgComponents } from './vector/inject-svg-components';
import { renderSvgWithTraits } from './vector/render-svg';

const fs = fsRaw.promises;

export const buildVectorArt = async (svgDirectory: string, outDir: string, options?: { skipExtraction?: boolean }) => {

    await injectSvgComponents(svgDirectory);
    await renderSvgWithTraits(svgDirectory, outDir);

    console.log(`DONE`);
    process.exit();
};

