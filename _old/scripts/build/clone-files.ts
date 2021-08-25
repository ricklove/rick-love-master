// Clone the files and expand the imports found in each

import { getFileInfo, getPathNormalized, copyFile } from 'utils/files';


export const cloneFile = async (sourceFilePath: string, sourceRootPath: string, targetRootPath: string, options?: { skipIfDestinationNewer?: boolean }): Promise<string | null> => {
    const sourceFileFullPath = getPathNormalized(sourceFilePath);
    const relativePath = sourceFileFullPath.replace(`${sourceRootPath}/`, ``);
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
    await copyFile(sourceFileFullPath, destFilePath, { readonly: true, overwrite: true });
    return destFilePath;
};
