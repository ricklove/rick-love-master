/* eslint-disable no-await-in-loop */
import { directoryContains, getFiles, renameDirectory, getDirectoryContents, renameFile, getPathNormalized } from 'utils/files';
import { deleteEmptyDirectories } from './clean';

export const isModuleRootPath = async (fullPath: string) => {
    return await directoryContains(fullPath, `.package.json`);
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


const flattenDotPackages = async () => {
    const dotPackageFilePaths = await getFiles(`../../code`, x => x.endsWith(`/src/.package.json`));
    const dotPackageMovements = dotPackageFilePaths.map(x => x.replace(`/src/.package.json`, ``)).map(x => ({ from: `${x}/src`, to: x }));
    for (const x of dotPackageMovements) {
        const dirItems = await getDirectoryContents(x.from);

        // Move each item
        for (const f of dirItems) {
            if (f.isDirectory()) {
                await renameDirectory(getPathNormalized(x.from, f.name), getPathNormalized(x.to, f.name));
            } else if (f.isFile()) {
                await renameFile(getPathNormalized(x.from, f.name), getPathNormalized(x.to, f.name));
            }
        }

        // Delete empty directory
        await deleteEmptyDirectories(x.from);
    }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
flattenDotPackages();
