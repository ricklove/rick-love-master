import { exec } from 'child_process';
import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { injectSvgComponents } from './inject-svg-components';
import { processImageLayerFiles } from './process-image-layers';

const fs = fsRaw.promises;


export const buildVectorArt = async (svgDirectory: string, outDir: string, options?: { skipExtraction?: boolean }) => {

    await injectSvgComponents(svgDirectory);

    // const extractionDir = `${outDir}/xcf`;
    // const dataDir = `${outDir}/data`;

    // // TEMP: Skip extraction
    // if (!options?.skipExtraction){
    //     if (fsRaw.existsSync(outDir)){
    //         await fs.rmdir(outDir, { recursive: true });
    //     }
    //     await extractXcfLayers(svgDirectory, extractionDir);
    // }

    // await processImages(extractionDir, dataDir);

    console.log(`DONE`);
    process.exit();
};
