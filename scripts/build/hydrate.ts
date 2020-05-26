/* eslint-disable no-console */
import { processDirectoryFiles, getFileName, deleteFile, readFile, readFileAsJson, getPathNormalized, getProjectRootDirectoryPath } from 'utils/files';
import { generateTsconfigPaths, loadTsConfigPaths } from './generate-tsconfig-paths';
import { FileDependencies, processImports_returnDependencies, saveDependenciesToModulePackageJson } from './process-imports';
import { PackageJson } from './types';

/** Add package.json to each module with detected dependencies */
export const hydrate_all = async (root: string, rootCode: string) => {
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


/** Remove package.json dependencies and add all dependencies to ${root}/package.json */
export const dehydrate_all = async (root: string, rootCode: string) => {
    await processDirectoryFiles(rootCode, async (x) => {
        if (getFileName(x) !== `package.json`) { return; }

        const json = await readFileAsJson<PackageJson>(x);
        const hasOtherStuff = JSON.stringify(json) !== JSON.stringify({ name: json.name, dependencies: json.dependencies });

        if (!hasOtherStuff) {
            deleteFile(x);
        }

        // TODO: Handle other content
        // Leave it alone if there is other content
    });
};


const test = async () => {
    const root = getPathNormalized(await getProjectRootDirectoryPath(__dirname));
    dehydrate_all(root, getPathNormalized(root, `./code`));
};
test();
