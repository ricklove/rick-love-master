/* eslint-disable no-console */
import { processDirectoryFiles, getFileName, deleteFile, readFileAsJson, getPathNormalized, getProjectRootDirectoryPath, getFiles, getDirectoryPath, copyFile, getFileInfo } from 'utils/files';
import { generateTsconfigPaths, loadTsConfigPaths } from './generate-tsconfig-paths';
import { FileDependencies, processImports_returnDependencies, saveDependenciesToModulePackageJson } from './process-imports';
import { PackageJson } from './types';

/** Clone Templates files into target */
const hydrate_template = async (templateJsonPath: string) => {

    const targetRootPath = getDirectoryPath(templateJsonPath);
    const templateJsonObj = await readFileAsJson<{ extends: string }>(templateJsonPath);
    const templatePath = getPathNormalized(targetRootPath, templateJsonObj.extends);

    await processDirectoryFiles(templatePath, async (x) => {
        const relPath = x.replace(`${templatePath}/`, ``);
        const destPath = getPathNormalized(targetRootPath, relPath);
        const destExtraTemplatePath = `${destPath}.template`;
        try {
            await copyFile(x, destPath, { overwrite: false, readonly: true });
        } catch{
            const sourceInfo = await getFileInfo(x);
            const destInfo = await getFileInfo(destPath);
            if (sourceInfo?.size === destInfo?.size) { return; }
            // if (sourceInfo?.mtime === destInfo?.mtime) { return; }
            await copyFile(x, destExtraTemplatePath, { overwrite: false, readonly: true });
        }
    });
};

const hydrate_templatesAll = async (rootCode: string) => {
    const templateJsonFiles = await getFiles(rootCode, x => x.endsWith(`template.json`));
    await Promise.all(templateJsonFiles.map(async templateJsonPath => {
        await hydrate_template(templateJsonPath);
    }));
};

const dehydrate_template = async (templateJsonPath: string) => {

    const targetRootPath = getDirectoryPath(templateJsonPath);
    const templateJsonObj = await readFileAsJson<{ extends: string }>(templateJsonPath);
    const templatePath = getPathNormalized(targetRootPath, templateJsonObj.extends);

    await processDirectoryFiles(templatePath, async (x) => {
        const relPath = x.replace(`${templatePath}/`, ``);
        const destPath = getPathNormalized(targetRootPath, relPath);

        // Delete extra template files
        const destExtraTemplatePath = `${destPath}.template`;
        if (await getFileInfo(destExtraTemplatePath)) { await deleteFile(destExtraTemplatePath); }

        // Delete file if NOT changed
        const sourceInfo = await getFileInfo(x);
        const destInfo = await getFileInfo(destPath);
        if (sourceInfo?.size !== destInfo?.size) { return; }

        await deleteFile(destPath);
    });
};

const dehydrate_templatesAll = async (rootCode: string) => {
    const templateJsonFiles = await getFiles(rootCode, x => x.endsWith(`template.json`));
    await Promise.all(templateJsonFiles.map(async templateJsonPath => {
        await dehydrate_template(templateJsonPath);
    }));
};

/** Add package.json to each module with detected dependencies */
export const hydrate_yarnWorkspaces = async (root: string, rootCode: string) => {
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

    // Inject Template files
    const templateJsonFiles = await getFiles(rootCode, x => x === `template.json`);
    await Promise.all(templateJsonFiles.map(async templateJsonPath => {
        await hydrate_template(templateJsonPath);
    }));
};


/** Remove package.json dependencies and add all dependencies to ${root}/package.json */
export const dehydrate_yarnWorkspaces = async (root: string, rootCode: string) => {
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

    // Delete files that belong to a template

};


const test = async () => {
    const root = getPathNormalized(await getProjectRootDirectoryPath(__dirname));
    // hydrate_pureCode(root, getPathNormalized(root, `./code`));
    // hydrate_yarnWorkspaces(root, getPathNormalized(root, `./code`));
    // hydrate_templatesAll(getPathNormalized(root, `./code`));
    dehydrate_templatesAll(getPathNormalized(root, `./code`));
};
test();
