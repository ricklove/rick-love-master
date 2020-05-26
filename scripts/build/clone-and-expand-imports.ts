// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, readFile, writeFile, copyFile } from 'utils/files';
import { TsConfigPath, loadTsConfigPaths } from './generate-tsconfig-paths';

const targetFromRootPath = `./build/src/`;

export const cloneFileAndExpandExport = async (sourceFilePath: string, rootRaw?: string, tsconfigPaths?: TsConfigPath[]) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const destFilePath = getPathNormalized(root, targetFromRootPath, relativePath);
    const fileInfo = await getFileInfo(sourceFilePath);
    const destFileInfo = await getFileInfo(destFilePath);

    // Skip non files
    if (!fileInfo || !fileInfo.isFile()) { return; }

    // Skip if the destination is newer
    if (destFileInfo && destFileInfo.mtime > (fileInfo?.mtime ?? 0)) { return; }

    if (!sourceFileFullPath.endsWith(`.ts`)
        && !sourceFileFullPath.endsWith(`.tsx`)
        && !sourceFileFullPath.endsWith(`.js`)
        && !sourceFileFullPath.endsWith(`.jsx`)) {
        await copyFile(sourceFileFullPath, destFilePath);
        return;
    }

    // Load File
    const content = await readFile(sourceFileFullPath);

    // Expand Imports
    const toRoot = [...new Array(relativePath.split(`/`).length - 1)].map(x => `../`).join(``);

    const p = tsconfigPaths ?? await loadTsConfigPaths(root);
    let contentFinal = content;
    p.forEach(x => { contentFinal = content.split(x.name).join(toRoot + x.path); });

    // WriteFile (as readonly to prevent manual edits)
    await writeFile(destFilePath, contentFinal, { readonly: true });
};

// cloneFileAndExpandExport(getPathNormalized(__dirname, `./build.ts`));
