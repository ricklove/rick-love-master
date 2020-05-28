/* eslint-disable no-console */
import { getProjectRootDirectoryPath, getPathNormalized, processDirectoryFiles } from 'utils/files';
import { generateTsconfigPaths, loadTsConfigPaths } from './generate-tsconfig-paths';
import { processImports_returnDependencies, FileDependencies, saveDependenciesToModulePackageJson } from './process-imports';

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
            // const destFile = await cloneFile(x, root, getTargetBuildPath(root), { skipIfDestinationNewer: false });
            // if (!destFile) { return; }
            const destFile = x;

            const r = await processImports_returnDependencies(destFile, root, tsConfigPaths);
            if (r) {
                fileDependencies.push(r);
            }
        });
        await saveDependenciesToModulePackageJson(fileDependencies, root);
    };
    await startup();

    // console.log(`--- Watching ---`);
    // watchFileChanges({ pathRoot: rootCode, runOnStart: false }, async (filesChanged) => {

    //     // await delay(1000);
    //     // console.log(`filesChanged`, filesChanged);

    //     // Update tsconfig
    //     if (await somePromise(filesChanged, isTsconfigPathDirectory)) {
    //         console.log(`Regenerate Tsconfig Paths`, filesChanged);
    //         generateTsconfigPaths(root);
    //     }

    //     // Clone and Expand Imports
    //     console.log(`Clone & Process Imports`, filesChanged);
    //     const tsConfigPaths = await loadTsConfigPaths(root);

    //     const fileDependencies = [] as FileDependencies[];
    //     await Promise.all(filesChanged.filter(x => x.startsWith(rootCode)).map(async x => {
    //         const destFile = await cloneFile(x, root, getTargetBuildPath(root), { skipIfDestinationNewer: false });
    //         if (!destFile) { return; }

    //         const r = await processImports_returnDependencies(destFile, root, tsConfigPaths);
    //         if (r) {
    //             fileDependencies.push(r);
    //         }
    //     }));
    //     await saveDependenciesToModulePackageJson(fileDependencies, root);

    //     console.log(`--- Watching ---`);
    // });
    // watchForFileChanges(x=>x.)
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
build();
