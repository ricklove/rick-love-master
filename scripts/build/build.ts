/* eslint-disable no-console */
import { watchFileChanges, getProjectRootDirectoryPath, getPathNormalized } from 'utils/files';
import { generateTsconfigPaths, isTsconfigPathDirectory } from './generate-tsconfig-paths';

const build = (rootRaw?: string) => {

    const root = getPathNormalized(rootRaw ?? getProjectRootDirectoryPath(__dirname));
    const rootCode = getPathNormalized(root, `./code`);

    watchFileChanges({ pathRoot: rootCode, runOnStart: false }, async (filesChanged) => {

        // console.log(`filesChanged`, filesChanged);

        // Update tsconfig
        if (filesChanged.some(x => isTsconfigPathDirectory(x))) {
            console.log(`Regenerating Tsconfig Paths`, filesChanged);
            generateTsconfigPaths(root);
        }

    });
    // watchForFileChanges(x=>x.)
};

build();
