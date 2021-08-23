/* eslint-disable no-await-in-loop */
import { getFiles, renameDirectory, getDirectoryContents, renameFile, getPathNormalized, getFileInfo, getDirectoryPath } from 'utils/files';
import { deleteEmptyDirectories } from './clean';

export const isPackageRootPath = async (fullPath: string) => {
    const fileInfo = await getFileInfo(getPathNormalized(fullPath, `./.package.json`));
    const fileInfo2 = await getFileInfo(getPathNormalized(fullPath, `./package.json`));
    return fileInfo || fileInfo2;
};

export const getPackageRootPath = async (fullPath: string) => {
    let dir = getDirectoryPath(fullPath);
    let parent = dir;
    while (!await isPackageRootPath(dir)) {
        parent = getPathNormalized(dir, `../`);
        if (parent === dir) {
            throw new Error(`No package root found for: ${fullPath}`);
        }
        dir = parent;
    }

    return dir;
};

// const renameDotModuleJsonToDotPackageJson = async () => {
//     await processDirectoryFiles(`../../code`, async x => {
//         if (x.endsWith(`/.module.json`)) {
//             await renameFile(x, x.replace(`/.module.json`, `/.package.json`));
//         }
//     });
// };

// // eslint-disable-next-line @typescript-eslint/no-floating-promises
// renameDotModuleJsonToDotPackageJson();


// const flattenDotPackages = async () => {
//     const dotPackageFilePaths = await getFiles(`../../code`, x => x.endsWith(`/src/.package.json`));
//     const dotPackageMovements = dotPackageFilePaths.map(x => x.replace(`/src/.package.json`, ``)).map(x => ({ from: `${x}/src`, to: x }));
//     for (const x of dotPackageMovements) {
//         const dirItems = await getDirectoryContents(x.from);

//         // Move each item
//         for (const f of dirItems) {
//             if (f.isDirectory()) {
//                 await renameDirectory(getPathNormalized(x.from, f.name), getPathNormalized(x.to, f.name));
//             } else if (f.isFile()) {
//                 await renameFile(getPathNormalized(x.from, f.name), getPathNormalized(x.to, f.name));
//             }
//         }

//         // Delete empty directory
//         await deleteEmptyDirectories(x.from);
//     }
// };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
// flattenDotPackages();
