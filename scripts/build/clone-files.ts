// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, getProjectRootDirectoryPath, copyFile } from 'utils/files';


export const cloneFile = async (sourceFilePath: string, targetRootPath: string, rootRaw?: string, options?: { skipIfDestinationNewer?: boolean }): Promise<string | null> => {
    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${root}/`, ``);
    const fileInfo = await getFileInfo(sourceFilePath);

    // Skip non files
    if (!fileInfo || !fileInfo.isFile()) { return null; }


    const destFilePath = getPathNormalized(targetRootPath, relativePath);

    // Skip?
    if (options?.skipIfDestinationNewer) {
        // Skip if the destination is newer
        const destFileInfo = await getFileInfo(destFilePath);
        if (destFileInfo && destFileInfo.mtime > (fileInfo?.mtime ?? 0)) { return null; }
    }

    // Copy the file
    await copyFile(sourceFileFullPath, destFilePath);
    return destFilePath;
};
