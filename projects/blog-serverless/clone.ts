/* eslint-disable no-console */
import { getProjectRootDirectoryPath, getPathNormalized, processDirectoryFiles } from 'utils/files';
import { loadTsConfigPaths } from '../../scripts/build/generate-tsconfig-paths';
import { processImports_expandToRelativeImports, processImports } from '../../scripts/build/process-imports';
import { cloneFile } from '../../scripts/build/clone-files';

export const getTargetBuildPath = (root: string) => {
    const targetFromRootPath = getPathNormalized(root, `./.build/src/`);
    return targetFromRootPath;
};

export const cloneToBuildFolder = async (rootRaw?: string) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const rootCode = getPathNormalized(root, `./code`);

    const startup = async () => {
        console.log(`Statup: Clone & Process Imports`);
        const tsConfigPaths = await loadTsConfigPaths(root);

        // Clone files and expand to relative
        await processDirectoryFiles(rootCode, async (x) => {
            const destFile = await cloneFile(x, root, getTargetBuildPath(root), { skipIfDestinationNewer: false });
            if (!destFile) { return; }

            await processImports(destFile, p => p.replace(`react-native-lite`, `react-native`), getTargetBuildPath(root), tsConfigPaths);
            await processImports_expandToRelativeImports(destFile, getTargetBuildPath(root), tsConfigPaths);
        });

    };
    await startup();
};
