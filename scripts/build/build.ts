/* eslint-disable no-console */
import { watchFileChanges, getProjectRootDirectoryPath, getPathNormalized } from 'utils/files';
import { somePromise } from 'utils/async';
import { generateTsconfigPaths, isTsconfigPathDirectory } from './generate-tsconfig-paths';

const build = async (rootRaw?: string) => {

    const root = getPathNormalized(rootRaw ?? await getProjectRootDirectoryPath(__dirname));
    const rootCode = getPathNormalized(root, `./code`);

    const startup = async () => {
        console.log(`Statup: Regenerate Tsconfig Paths`);
        await generateTsconfigPaths(root);
    };
    await startup();

    console.log(`--- Watching ---`);
    watchFileChanges({ pathRoot: rootCode, runOnStart: false }, async (filesChanged) => {

        // console.log(`filesChanged`, filesChanged);


        // Update tsconfig
        if (await somePromise(filesChanged, isTsconfigPathDirectory)) {
            console.log(`Regenerate Tsconfig Paths`, filesChanged);
            generateTsconfigPaths(root);
        }

    });
    // watchForFileChanges(x=>x.)
};

build();
