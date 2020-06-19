import { getProjectRootDirectoryPath, getPathNormalized } from 'utils/files';
import { loadCodeBase } from '../code-space-logic/load-code-base';

export const run = async () => {
    const gitRoot = await getProjectRootDirectoryPath(__dirname);
    await loadCodeBase(gitRoot, getPathNormalized(gitRoot, `./code`));
};
