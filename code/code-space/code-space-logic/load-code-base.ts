/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { processDirectoryItems, getProjectRootDirectoryPath, getPathNormalized, readFile, writeFile, getDirectoryPath } from 'utils/files';
import { toKeyValueArray, toKeyValueObject, toMap } from 'utils/objects';
import { loadTsConfigPaths } from 'utils-scripts/tsconfig-paths';
import { distinct } from 'utils/arrays';
import { CodeSpaceNode, CodeSpaceLink } from './types';

export const patterns = {
    // words: { regex: /\W(\w+)\W/g, iGroup: 1 },
    imports: {
        regex: new RegExp(`((?:(?:import|export)\\s+[^;]*\\s+from\\s*|(?:import|require)\\s*\\(\\s*)["'\`])([^"'\`]+)(["'\`])`, `g`),
        iGroup: 2,
    },
} as const;

let _nextId = 0;
const getNextId = () => { return `${_nextId++}`; };
export const loadCodeBase = async (projectRootPathRaw: string, rootPathRaw: string) => {
    const projectRootPath = getPathNormalized(projectRootPathRaw);
    const rootPath = getPathNormalized(rootPathRaw);

    const tsConfigPaths = await (await loadTsConfigPaths(projectRootPath)).map(x => ({
        ...x,
        fullPackagePath: getPathNormalized(projectRootPath, x.path),
    }));
    const getPackageInfo_fromFullPath = (fullPath: string) => {
        for (const p of tsConfigPaths) {
            if (`${fullPath}/`.startsWith(`${p.fullPackagePath}/`)) {
                const importPath = fullPath
                    .replace(p.fullPackagePath, p.name)
                    .replace(/\.tsx$/, ``)
                    .replace(/\.ts$/, ``)
                    .replace(/\.jsx$/, ``)
                    .replace(/\.js$/, ``)
                    ;
                return {
                    package: p,
                    importPath,
                    projectPath: getProjectPath(fullPath),
                };
            }
        }
        return null;
    };
    const getPackageInfo_fromImportPath = (importText: string) => {
        for (const p of tsConfigPaths) {
            if (`${importText}/`.startsWith(`${p.name}/`)) {
                const importPath = importText
                    .replace(/\.tsx$/, ``)
                    .replace(/\.ts$/, ``)
                    .replace(/\.jsx$/, ``)
                    .replace(/\.js$/, ``)
                    ;

                const fullPath = importPath
                    .replace(p.name, p.fullPackagePath)
                    ;
                return {
                    package: p,
                    importPath,
                    projectPath: getProjectPath(fullPath),
                };
            }
        }
        return null;
    };

    const getProjectPath = (fullPath: string) => {
        const projRelPath = getPathNormalized(fullPath)
            .replace(projectRootPath, ``)
            .replace(/\.tsx$/, ``)
            .replace(/\.ts$/, ``)
            .replace(/\.jsx$/, ``)
            .replace(/\.js$/, ``)
            ;
        return projRelPath;
    };

    const getImportProjectPaths = (text: string, fullPath: string) => {
        const { regex, iGroup } = patterns.imports;
        const matches = [...text.matchAll(regex) ?? []];

        const importProjectPaths = matches.map(m => {
            const importText = m[iGroup];
            const importPackageInfo = getPackageInfo_fromImportPath(importText);
            if (importPackageInfo) {
                return importPackageInfo.projectPath;
            }

            if (importText.startsWith(`.`)) {
                const startPath = getDirectoryPath(fullPath);
                const fullImportPath = getPathNormalized(startPath, importText);
                const projectPath = getProjectPath(fullImportPath);
                return projectPath;
            }

            return importText;
        });

        return importProjectPaths;
    };

    const allFilePaths = [] as string[];
    await processDirectoryItems(rootPath, {
        shouldSkipDirectory: (x) => x.includes(`node_modules`),
        onFile: async (x) => { allFilePaths.push(x); },
    });
    const allCodeFilePaths = allFilePaths.filter(x => x.endsWith(`.ts`) || x.endsWith(`.tsx`) || x.endsWith(`.js`) || x.endsWith(`.jsx`));
    const allCodeFileContent = await Promise.all(allCodeFilePaths.map(async x => {
        const text = await readFile(x);
        const packageInfo = getPackageInfo_fromFullPath(x);
        const projectPath = getProjectPath(x);
        return {
            fullPath: x,
            text,
            projectPath,
            packageInfo,
        };
    }));

    type CodeFile = typeof allCodeFileContent[0] & { importProjectPaths: string[], imports: { projectPath: string, target?: CodeFile }[] };
    const allCodeFilesWithImports = allCodeFileContent.map(x => {
        return {
            ...x,
            importProjectPaths: getImportProjectPaths(x.text, x.fullPath),
            imports: [],
        } as CodeFile;
    });

    const codeFileMap = toMap(allCodeFilesWithImports.map(x => ({ key: x.projectPath, value: x })));
    allCodeFilesWithImports.forEach(file => {
        const f = file;
        f.imports = f.importProjectPaths.map(x => ({ projectPath: x, target: codeFileMap.get(x) }));
    });

    const externalImportPaths = distinct(allCodeFilesWithImports.flatMap(x => x.imports.filter(y => !y.target).map(y => y.projectPath)));
    const allPackages = distinct(allCodeFilesWithImports.flatMap(x => x.packageInfo?.package.name ?? ``).filter(x => x));

    const data = {
        nodes: [
            ...allCodeFilesWithImports.map(x => ({ id: x.projectPath, title: `${x.projectPath}\n---\n${x.text}`, group: x.packageInfo?.package.name ?? `` })),
            ...externalImportPaths.map(x => ({ id: x, title: x, group: `External` })),
            ...allPackages.map(x => ({ id: x, title: x, group: x })),
        ],
        links: [
            ...allCodeFilesWithImports.flatMap(x => ({ source: x.packageInfo?.package.name, target: x.projectPath, priority: 1 })),
            ...allCodeFilesWithImports.flatMap(x => x.imports.map(y => ({ source: x.projectPath, target: y.projectPath, priority: y.projectPath.startsWith(`/`) ? 3 : 100 }))),
        ],
    };

    await writeFile(`./code-space-data.json`, JSON.stringify(data), { overwrite: true });
    const breakdance = `begin`;

    // const codeSpaceInitItems = await Promise.all(allCodeFilePaths.map(async x => {
    //     const text = await readFile(x);
    //     const codeSpaceContentNode: CodeSpaceNode = {
    //         id: getNextId(),
    //         kind: `fileContent`,
    //         text,
    //         links: [],
    //     };

    //     const codeSpaceFilePathNode: CodeSpaceNode = {
    //         id: getNextId(),
    //         kind: `filePath`,
    //         text: getImportPath(x),
    //         links: [],
    //     };
    //     const link: CodeSpaceLink = {
    //         a: { node: codeSpaceContentNode },
    //         b: { node: codeSpaceFilePathNode },
    //     };

    //     codeSpaceContentNode.links.push(link);
    //     codeSpaceFilePathNode.links.push(link);

    //     return {
    //         nodes: [
    //             codeSpaceContentNode,
    //             codeSpaceFilePathNode,
    //         ],
    //         links: [
    //             link,
    //         ],
    //     };
    // }));

    // const allNodes = codeSpaceInitItems.flatMap(x => x.nodes);
    // const allLinks = codeSpaceInitItems.flatMap(x => x.links);
    // const nodesMap = toMap(allNodes.map(x => ({ key: x.text, value: x })));

    // for (const pattern of toKeyValueArray(patterns)) {
    //     for (const n of allNodes) {
    //         const { regex, iGroup } = pattern.value;
    //         const matches = [...n.text.matchAll(regex) ?? []];

    //         matches.forEach(m => {
    //             const textRaw = m[iGroup];
    //             const text = getImportPath_used(textRaw);

    //             let nodeMatch = nodesMap.get(text);
    //             const index = (m.index ?? 0) + m[0].indexOf(text);
    //             const { length } = m[iGroup];

    //             if (!nodeMatch) {
    //                 const newNode: CodeSpaceNode = {
    //                     id: getNextId(),
    //                     kind: `contentMatch`,
    //                     text,
    //                     links: [],
    //                 };
    //                 allNodes.push(newNode);
    //                 nodesMap.set(newNode.text, newNode);
    //                 nodeMatch = newNode;
    //             }

    //             const link: CodeSpaceLink = {
    //                 a: { node: n },
    //                 b: { node: nodeMatch, range: { index, length } },
    //             };
    //             link.a.node.links.push(link);
    //             link.b.node.links.push(link);
    //             allLinks.push(link);
    //         });

    //         // Add refs as links

    //         const breakdance = `begin`;

    //     }
    // }

    // const allNodesSorted = [...allNodes].sort((a, b) => a.text.localeCompare(b.text));

    // const data = {
    //     nodes: allNodesSorted.map(x => ({ id: x.id, title: x.text, kind: x.kind })),
    //     links: allLinks.map(x => ({ source: x.a.node.id, target: x.b.node.id })),
    // };

    // await writeFile(`./code-space-data.json`, JSON.stringify(data), { overwrite: true });
    // const breakdance = `begin`;
};


const run = async () => {
    const gitRoot = await getProjectRootDirectoryPath(__dirname);
    await loadCodeBase(gitRoot, getPathNormalized(gitRoot, `./code`));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
