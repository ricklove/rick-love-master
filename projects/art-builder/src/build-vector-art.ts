import { exec } from 'child_process';
import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { injectSvgComponents } from './vector/inject-svg-components';
import { processImageLayerFiles } from './process-image-layers';
// import { renderSvg } from './vector/render-svg';

const fs = fsRaw.promises;


export const buildVectorArt = async (svgDirectory: string, outDir: string, options?: { skipExtraction?: boolean }) => {

    await injectSvgComponents(svgDirectory);
    // await renderSvg(svgDirectory, outDir);


    console.log(`DONE`);
    process.exit();
};

