/* eslint-disable no-console */
import { watchFileChanges, getProjectRootDirectoryPath, getPathNormalized, processDirectoryFiles } from 'utils/files';
import { somePromise } from 'utils/async';
import { generateTsconfigPaths, isTsconfigPathDirectory, loadTsConfigPaths } from './generate-tsconfig-paths';
import { processImports_returnDependencies, FileDependencies, saveDependenciesToModulePackageJson } from './process-imports';
import { cloneFile } from './clone-files';

export const getTargetBuildPath = (root: string) => {
    const targetFromRootPath = getPathNormalized(root, `./build/src/`);
    return targetFromRootPath;
};

const build = async (rootRaw?: string) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const rootCode = getPathNormalized(root, `./code`);

    const startup = async () => {
        console.log(`Statup: Regenerate Tsconfig Paths`);
        await generateTsconfigPaths(root);

        console.log(`Statup: Clone & Process Imports`);
        const tsConfigPaths = await loadTsConfigPaths(root);

        const fileDependencies = [] as FileDependencies[];
        await processDirectoryFiles(rootCode, async (x) => {
            const destFile = await cloneFile(x, root, getTargetBuildPath(root), { skipIfDestinationNewer: false });
            if (!destFile) { return; }

            const r = await processImports_returnDependencies(destFile, root, tsConfigPaths);
            if (r) {
                fileDependencies.push(r);
            }
        });
        await saveDependenciesToModulePackageJson(fileDependencies, root);
    };
    await startup();

    console.log(`--- Watching ---`);
    watchFileChanges({ pathRoot: rootCode, runOnStart: false }, async (filesChanged) => {

        // await delay(1000);
        // console.log(`filesChanged`, filesChanged);

        // Update tsconfig
        if (await somePromise(filesChanged, isTsconfigPathDirectory)) {
            console.log(`Regenerate Tsconfig Paths`, filesChanged);
            generateTsconfigPaths(root);
        }

        // Clone and Expand Imports
        console.log(`Clone & Process Imports`, filesChanged);
        const tsConfigPaths = await loadTsConfigPaths(root);

        const fileDependencies = [] as FileDependencies[];
        await Promise.all(filesChanged.filter(x => x.startsWith(rootCode)).map(async x => {
            const destFile = await cloneFile(x, root, getTargetBuildPath(root), { skipIfDestinationNewer: false });
            if (!destFile) { return; }

            const r = await processImports_returnDependencies(destFile, root, tsConfigPaths);
            if (r) {
                fileDependencies.push(r);
            }
        }));
        await saveDependenciesToModulePackageJson(fileDependencies, root);

        console.log(`--- Watching ---`);
    });
    // watchForFileChanges(x=>x.)
};

build();
