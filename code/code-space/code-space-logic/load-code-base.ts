import { processDirectoryItems } from 'utils/files';

export const loadCodeBase = async (rootPath: string) => {

    const allFilePaths = [] as string[];
    await processDirectoryItems(rootPath, {
        shouldSkipDirectory: async (x) => x.includes(`node_modules`),
        onFile: async (x) => { allFilePaths.push(x); },
    });
    const allTypescriptFilePaths = allFilePaths.filter(x => x.endsWith(`.ts`) || x.endsWith(`.tsx`) || x.endsWith(`.js`) || x.endsWith(`.jsx`));

    const allFileContent;

};
export const patterns = {
    words: { regex: /\W(\w+)\W/g, iGroup: 1 },
    imports: { regex: new RegExp(`((?:(?:import|export)\\s+[^;]*\\s+from\\s*|(?:import|require)\\s*\\(\\s*)["'\`])([^"'\`]+)(["'\`])`, `g`), iGroup: 2 },
};
