import { directoryContains, processDirectoryFiles, renameFile } from 'utils/files';

export const isModuleRootPath = async (fullPath: string) => {
    return await directoryContains(fullPath, `.package.json`);
};

const renameDotModuleJsonToDotPackageJson = async () => {

    await processDirectoryFiles(`../../code`, async x => {
        if (x.endsWith(`/.module.json`)) {
            await renameFile(x, x.replace(`/.module.json`, `/.package.json`));
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
renameDotModuleJsonToDotPackageJson();
