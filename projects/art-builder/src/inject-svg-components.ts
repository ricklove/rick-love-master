import fsRaw from 'fs';
import path from 'path';
import { loadImageFile, saveImageFile } from './image-files';
import xmljs from 'xml-js';

const fs = fsRaw.promises;

const normalizeFilePath = (filePath: string) => path.resolve(filePath).replace(/\\/g, `/`);

export const injectSvgComponents = async (sourceDir: string) => {
    console.log(`# Inject Svg Components`, { sourceDir });

    const dirFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    const svgFilePaths = dirFiles
        .filter(x => x.name.endsWith(`.svg`))
        .map(x => normalizeFilePath(path.join(sourceDir, x.name)))
        .sort((a, b) => a.localeCompare(b));

    // Find svg links and replace the parent content
    // - Keep the image tag (it should have disabled visibility)
    // - Remove all other tags and replace
    // - Add missing defs
    // - Remove unused defs
    // <image
    //     xlink:href="head.svg"
    // />

    console.log(`injectSvgComponents - svg files`, { svgFilePaths });

    const visitNode = (node: xmljs.Element,
        handleNode: (node: xmljs.Element) => void | { skipChildren?: boolean },
    ) => {
        const result = handleNode(node);
        if (result && result.skipChildren){ return;}

        node.elements?.forEach(n => {visitNode(n, handleNode);});
    };

    // WARNING: This loads all svg objects into memory at once
    const svgObjsRaw = await Promise.all(svgFilePaths.map(async (x) => {
        const svgFileContent = await fs.readFile(x, { encoding: `utf-8` });
        const svgObj = xmljs.xml2js(svgFileContent, { compact: false }) as SvgDoc;
        return {
            filePath: x,
            svgObj,
        };
    }));

    type SvgDoc = xmljs.Element & {
        elements: [{
            name: 'svg';
            elements: ({
                name: 'sodipodi:namedview';
            }|{
                name: 'defs';
            }|xmljs.Element)[];
        }];
    };
    type SvgRef = {
        xlinkRaw: string;
        svgFilePath: string;
        svgRef?: SvgObj;
    };
    type SvgObj = typeof svgObjsRaw[number] & {
        svgRefs: SvgRef[];
        refDepth: number;
        hasChanged: boolean;
    };
    const svgObjs: SvgObj[] = svgObjsRaw.map(x => ({
        ...x,
        svgRefs: [],
        refDepth: 0,
        hasChanged: false,
    }));

    // Identify refs
    const findSvgRef = (x: SvgObj, n: xmljs.Element): void | SvgRef => {
        if (n.name !== `image`){ return; }

        const v = n.attributes?.[`xlink:href`];
        if (!v){ return; }

        const link = v + ``;
        if (!link.endsWith(`.svg`)){ return; }

        const filePath = normalizeFilePath(path.join(path.dirname(x.filePath), link));
        const svgRef = svgObjs.find(x => x.filePath === filePath);

        console.log(`Found svg ref`, { link, dest: x });

        return {
            xlinkRaw: link,
            svgFilePath: filePath,
            svgRef,
        };
    };

    svgObjs.forEach((x) => {

        const svgRefs = [] as SvgRef[];
        visitNode(x.svgObj, (n) => {
            const link = findSvgRef(x, n);
            if (!link){ return; }

            svgRefs.push(link);
        });

        x.svgRefs = svgRefs;
    });

    // Sort by ref depth (prevent circular refs)
    const visited = new Set([] as SvgObj[]);
    const getRefDepth = (x?: SvgObj) => {
        if (!x){ return 0; }
        if (visited.has(x)){ return 0;}
        visited.add(x);

        if (x.refDepth){ return x.refDepth; }
        x.refDepth = 1 + Math.max(...x.svgRefs.map(r => getRefDepth(r.svgRef)));
        return x.refDepth;
    };
    svgObjs.forEach(getRefDepth);
    svgObjs.sort((a, b) => a.refDepth - b.refDepth);

    // Inject refs
    for (const s of svgObjs){
        visitNode(s.svgObj, (n) => {
            // If this is a parent of the image ref
            if (!n.elements){ return; }

            const ref = n.elements.map(child => findSvgRef(s, child)).find(x => x);
            if (!ref){ return; }

            const r = ref.svgRef;
            if (!r){ return; }

            const imageElement = n.elements.find(x => x.name === `image`);
            if (!imageElement){ return; }

            const content = r.svgObj.elements
                .find(x => x.name === `svg`)?.elements
                ?.filter(n => n.name !== `defs` && n.name !== `sodipodi:namedview`) ?? [];

            const oldElements = n.elements;
            const newElements = [
                imageElement,
                ...content,
            ];
            n.elements = newElements;
            console.log(`injectSvgComponents - Updated content`, { newElements, oldElements });

            // Add missing defs
            type SvgDef = {
                attributes: {
                    id: string;
                };
            };
            const sourceDefs = r.svgObj.elements
                .find(x => x.name === `svg`)?.elements
                ?.find(x => x.name === `defs`) as { elements: SvgDef[] };
            const destDefs = s.svgObj.elements
                .find(x => x.name === `svg`)?.elements
                ?.find(x => x.name === `defs`) as { elements: SvgDef[] };

            if (!sourceDefs?.elements || !destDefs?.elements){ return; }

            const missingDefs = sourceDefs.elements
                .filter(sourceDef => !destDefs.elements.find(d => d.attributes.id === sourceDef.attributes.id));

            destDefs.elements.push(...missingDefs);
            console.log(`injectSvgComponents - Adding missing defs`, { missingDefs, destDefs });

            s.hasChanged = true;

            return { skipChildren: true };
        });
    }


    // Save all svgs
    await Promise.all(svgObjs.filter(x => x.hasChanged).map(async s => {
        const newContent = xmljs.js2xml(s.svgObj, { spaces: 2, indentAttributes: true });
        await fs.writeFile(s.filePath, newContent);

        console.log(`injectSvgComponents - file updated`, { file: s.filePath, newContent });
    }));

};
