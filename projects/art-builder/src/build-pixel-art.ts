import { exec } from 'child_process';
import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { processImageLayerFiles } from './process-image-layers';

const fs = fsRaw.promises;

const extractXcfLayers = async (sourceDirectory: string, destDir: string) => {
    console.log(`# Extracting Images from *.xcf`, { sourceDirectory, destDir });

    /** GIMP must be installed on the system - also, this is using the windows install path */
    const gimpExePath = `C:/Program Files/GIMP 2/bin/gimp-2.10.exe`;

    await fs.mkdir(destDir, { recursive: true });

    // List to error output
    const watcher = fsRaw.watch(destDir, { recursive: true, encoding: `utf-8` });
    watcher.on(`change`, (eventType, fileNameRaw) => {
        const fileName = fileNameRaw + ``;

        if (eventType === `rename`){
            console.log(`Created`, { fileName });
            return;
        }

        // Ignore others
        const ignore = true;
        if (ignore){ return;}

        if (fileName.endsWith(`gimpstdout.log`)){
            console.log(`gimp log changed`, { fileName, eventType });
            return;
        }
        if (fileName.endsWith(`gimpstrerr.log`)){
            console.log(`gimp err changed`, { fileName, eventType });
            return;
        }

        console.log(`file changed`, { fileName, eventType });

    });

    const runScript = `
import sys;
sys.path=['.']+sys.path;
sys.path.insert(0, './scripts');
import exportLayersFromXcf;

exportLayersFromXcf.run('${sourceDirectory}', '${destDir}')
`.trim().replace(/\r/g, ``).replace(/\n/g, ` `);

    const { stdout, stderr } = await promisify(exec)(
        `"${gimpExePath}" -idf --batch-interpreter python-fu-eval -b "${runScript}" -b "pdb.gimp_quit(1)"`);

    console.log(stdout);
    console.log(stderr);

    watcher.close();
};


const processImages = async (sourceDir: string, destDir: string) => {
    console.log(`# Processing Images`, { sourceDir, destDir });

    const dirs = await fs.readdir(sourceDir, { withFileTypes: true });
    for (const d of dirs){
        const subDir = path.join(sourceDir, d.name);
        if (!d.isDirectory()){ continue; }

        await processImageLayerFiles(subDir, destDir);
    }
};

export const buildPixelArt = async (xcfDirectory: string, outDir: string, options?: { skipExtraction?: boolean }) => {

    const extractionDir = `${outDir}/xcf`;
    const dataDir = `${outDir}/data`;

    // TEMP: Skip extraction
    if (!options?.skipExtraction){
        if (fsRaw.existsSync(outDir)){
            await fs.rmdir(outDir, { recursive: true });
        }
        await extractXcfLayers(xcfDirectory, extractionDir);
    }

    await processImages(extractionDir, dataDir);

    console.log(`DONE`);
    process.exit();
};
