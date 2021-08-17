import { exec } from 'child_process';
import fsRaw from 'fs';
import { promisify } from 'util';

const fs = fsRaw.promises;

const extractXcfLayers = async (sourceDirectory: string, destDir: string) => {
    console.log(`# Extracting Images from *.xcf`, { sourceDirectory, destDir });
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

    const { stdout, stderr } = await promisify(exec)(
        `"${gimpExePath}" -idf --batch-interpreter python-fu-eval -b "import sys;sys.path=['.']+sys.path;import convertXCF;convertXCF.run('${sourceDirectory}', '${destDir}')" -b "pdb.gimp_quit(1)"`);

    console.log(stdout);
    console.log(stderr);

    watcher.close();
};

const processImages = async (sourceDir: string, destDir: string) => {
    console.log(`# Processing Images`, { sourceDir, destDir });

};

export const buildPixelArt = async (xcfDirectory: string) => {

    const outDir = `./out`;
    const extractionDir = `${outDir}/xcf`;
    const dataDir = `${outDir}/data`;

    if (fsRaw.existsSync(outDir)){
        await fs.rmdir(outDir, { recursive: true });
    }

    await extractXcfLayers(xcfDirectory, extractionDir);
    await processImages(extractionDir, dataDir);

    console.log(`DONE`);
    process.exit();
};

void buildPixelArt(`./art-test`);
