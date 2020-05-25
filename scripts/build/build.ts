import { watchFileChanges, getProjectRootDirectoryPath } from 'utils/files';
import { generateTsconfigPaths } from './generate-tsconfig-paths';

const build = (rootRaw?: string) => {

    const root = rootRaw ?? getProjectRootDirectoryPath(__dirname);

    watchFileChanges({ pathRoot: root, runOnStart: true }, async (filesChanged) => {

        // Update tsconfig
        generateTsconfigPaths(root);

    });
    // watchForFileChanges(x=>x.)
};

build();
