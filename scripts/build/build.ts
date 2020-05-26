/* eslint-disable no-console */
import { watchFileChanges, getProjectRootDirectoryPath, getPathNormalized, processDirectoryFiles } from 'utils/files';
import { somePromise } from 'utils/async';
import { delay } from 'dork/utils';
import { generateTsconfigPaths, isTsconfigPathDirectory, loadTsConfigPaths } from './generate-tsconfig-paths';
import { cloneFileAndExpandExport } from './clone-and-expand-imports';

const build = async (rootRaw?: string) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const rootCode = getPathNormalized(root, `./code`);

    const startup = async () => {
        console.log(`Statup: Regenerate Tsconfig Paths`);
        await generateTsconfigPaths(root);

        console.log(`Statup: Clone & Expand Imports`);
        const tsConfigPaths = await loadTsConfigPaths(root);
        await processDirectoryFiles(rootCode, async (x) => cloneFileAndExpandExport(x, root, tsConfigPaths));
    };
    await startup();

    console.log(`--- Watching ---`);
    watchFileChanges({ pathRoot: rootCode, runOnStart: false }, async (filesChanged) => {

        await delay(1000);
        // console.log(`filesChanged`, filesChanged);

        // Update tsconfig
        if (await somePromise(filesChanged, isTsconfigPathDirectory)) {
            console.log(`Regenerate Tsconfig Paths`, filesChanged);
            generateTsconfigPaths(root);
        }

        // Clone and Expand Imports
        console.log(`Clone & Expand Imports`, filesChanged);
        const tsConfigPaths = await loadTsConfigPaths(root);
        await Promise.all(filesChanged.filter(x => x.startsWith(rootCode)).map(x => cloneFileAndExpandExport(x, root, tsConfigPaths)));

        console.log(`--- Watching ---`);
    });
    // watchForFileChanges(x=>x.)
};

build();
