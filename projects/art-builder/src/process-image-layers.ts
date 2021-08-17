import fsRaw from 'fs';
import path from 'path';
import { loadImageFile, saveImageFile } from './image-files';

const fs = fsRaw.promises;


export const processImageLayerFiles = async (sourceDir: string, destDir: string) => {
    console.log(`# Processing Image Layer Files`, { sourceDir, destDir });

    const dirFiles = await fs.readdir(sourceDir, { withFileTypes: true });
    const pngFilePaths = dirFiles
        .filter(x => x.name.endsWith(`.png`))
        .map(x => path.join(sourceDir, x.name).replace(/\\/g, `/`))
        .sort((a, b) => a.localeCompare(b));


    console.log(`processImageLayerFiles - Get Layer Infos from Png Files`, { pngFilePaths });
    const fileInfos = pngFilePaths.map(f => {


        const fileName = path.basename(f);
        const groupName = fileName.match(/G_([^-]+)-/)?.[1] ?? ``;
        const layerNameParts = fileName.match(/(C|P)_([^.]+)./);
        const layerType = (layerNameParts?.[1] ?? ``) as '' | 'C' | 'P';
        const layerName = layerNameParts?.[2] ?? ``;
        const layerNamePrefix = layerName.split(`_`)[0];
        const layerNameVariant = layerName.split(`_`).slice(1).join(`_`);
        const layerIndex = parseInt(fileName.match(/^([^-]+)-/)?.[1] || `0`, 10);

        return {
            filePath: f,
            fileName,
            groupName,
            layerType,
            layerName,
            layerNamePrefix,
            layerNameVariant,
            layerIndex,
        };
    });

    const layerInfos = fileInfos.map(f => {
        const pixelFile = fileInfos.find(x => x.layerType === `P` && x.layerNamePrefix === f.layerNamePrefix);
        const detailFilePath = pixelFile?.filePath;
        return {
            ...f,
            filePath: undefined,
            partFilePath: f.filePath,
            detailFilePath,
        };
    })
        .filter(x => x.layerType === `C`)
    ;

    if (!layerInfos.length){
        console.error(`processImageLayerFiles - No part layers found`, { sourceDir, fileInfos });
        return;
    }


    console.log(`processImageLayerFiles - Extract Image Segments from Layers`, { layerInfos });

    const debug_cloneImages = false;
    if (debug_cloneImages){
        for (const l of layerInfos){
            const files = [
                { filePath: l.detailFilePath, pixels: !!l.detailFilePath && await loadImageFile(l.detailFilePath) },
                { filePath: l.partFilePath, pixels: await loadImageFile(l.partFilePath) },
            ];

            for (const f of files){
                if (!f.filePath || !f.pixels){ continue;}

                const segmentFilePath = f.filePath.replace(`/xcf`, `/segments`);
                await fs.mkdir(path.dirname(segmentFilePath), { recursive: true });
                await saveImageFile(segmentFilePath, f.pixels, `png`);
            }
        }
    }


    type RGB = { r: number, g: number, b: number };
    const getColorKey = ({ r, g, b }: RGB) => {
        return `${r.toString(16).padStart(2, `0`)}${g.toString(16).padStart(2, `0`)}${b.toString(16).padStart(2, `0`)}`;
    };

    const layerImageSegments = await Promise.all(layerInfos.map(async l => {
        const detailPixels = !!l.detailFilePath && await loadImageFile(l.detailFilePath);
        const partPixels = await loadImageFile(l.partFilePath);

        const segments = {} as {
            [baseColorKey: string]: {
                baseColorKey: string;
                baseColor: RGB;
                data: Uint8ClampedArray;
            };
        };
        const getOrCreateSegment = (baseColor: RGB) => {
            const baseColorKey = getColorKey(baseColor);
            if (!segments[baseColorKey]){
                const data = new Uint8ClampedArray(partPixels.data.length);
                segments[baseColorKey] = {
                    baseColorKey,
                    baseColor,
                    data,
                };
            }
            return segments[baseColorKey];
        };

        // Clone whole data
        const debug_cloneImagePixels = false;
        if (debug_cloneImagePixels){
            const debug_segmentParts = getOrCreateSegment({ r: 0, g: 0, b: 0 });
            const debug_segmentImage = getOrCreateSegment({ r: 0, g: 0, b: 1 });
            for (let i = 0; i < partPixels.data.length; i += 4){
                debug_segmentParts.data[i + 0] = partPixels.data[i + 0];
                debug_segmentParts.data[i + 1] = partPixels.data[i + 1];
                debug_segmentParts.data[i + 2] = partPixels.data[i + 2];
                debug_segmentParts.data[i + 3] = partPixels.data[i + 3];
            }
            if (detailPixels){
                for (let i = 0; i < partPixels.data.length; i += 4){
                    debug_segmentImage.data[i + 0] = detailPixels.data[i + 0];
                    debug_segmentImage.data[i + 1] = detailPixels.data[i + 1];
                    debug_segmentImage.data[i + 2] = detailPixels.data[i + 2];
                    debug_segmentImage.data[i + 3] = detailPixels.data[i + 3];
                }
            }
        }

        // Clone each part
        if (detailPixels){
            for (let i = 0; i < partPixels.data.length; i += 4){
                const p = {
                    r: partPixels.data[i + 0],
                    g: partPixels.data[i + 1],
                    b: partPixels.data[i + 2],
                    a: partPixels.data[i + 3],
                };

                // Alpha threshold
                if (p.a < 125){ continue; }
                if (p.r <= 0 && p.g <= 0 && p.b <= 0){ continue; }

                const segment = getOrCreateSegment(p);

                // segment.data[i + 0] = p.r;
                // segment.data[i + 1] = p.g;
                // segment.data[i + 2] = p.b;
                // segment.data[i + 3] = 255;

                // Remove alpha
                segment.data[i + 0] = detailPixels.data[i + 0];
                segment.data[i + 1] = detailPixels.data[i + 1];
                segment.data[i + 2] = detailPixels.data[i + 2];
                segment.data[i + 3] = 255;
            }
        }

        const imageSegments = Object.values(segments).map(x => {
            return {
                baseColorKey: x.baseColorKey,
                baseColor: x.baseColor,
                imageData: {
                    data: x.data,
                    width: partPixels.width,
                    height: partPixels.height,
                } as ImageData,
            };
        });

        return {
            layer: l,
            imageSegments,
        };
    }));

    const debug_saveImageSegmentFiles = true;
    if (debug_saveImageSegmentFiles){
        console.log(`processImageLayerFiles - Debug - Save Image Segment Files`, { layerImageSegments });

        for (const l of layerImageSegments){
            for (const s of l.imageSegments){
                const segmentFilePath = l.layer.partFilePath.replace(`/xcf`, `/segments`).replace(`.png`, `-${s.baseColorKey}.png`);
                await fs.mkdir(path.dirname(segmentFilePath), { recursive: true });
                await saveImageFile(segmentFilePath, s.imageData, `png`);
            }
        }
    }

    const groupLayerSegments = {} as {
        [groupName: string]: {
            groupName: string;
            layerOptions: {
                [layerName: string]: {
                    layerName: string;
                    layer: typeof layerInfos[number];
                    segments: typeof layerImageSegments[number][];
                };
            };
        };
    };

    layerImageSegments.forEach(x => {
        if (!groupLayerSegments[x.layer.groupName]){
            groupLayerSegments[x.layer.groupName] = {
                groupName: x.layer.groupName,
                layerOptions: {},
            };
        }
        const group = groupLayerSegments[x.layer.groupName];

        if (!group.layerOptions[x.layer.layerName]){
            group.layerOptions[x.layer.layerName] = {
                layerName: x.layer.layerName,
                layer: x.layer,
                segments: [],
            };
        }
        const layerOption = group.layerOptions[x.layer.layerName];

        layerOption.segments.push(x);
    });

    const debug_createSamples = true;
    if (debug_createSamples){

        type SampleMaker = {
            name: string;
            modifyPixel: (baseColor: RGB, p: RGB, layer: { groupName: string, layerName: string }) => RGB|null;
        };

        const chooseRandomGroupLayers = () => {
            const groupLayerOptions = Object.values(groupLayerSegments).map(x => ({
                groupName: x.groupName,
                layerOptions: Object.values(x.layerOptions).map(x => x.layerName),
            })).map(x => ({
                groupName: x.groupName,
                layerName: x.layerOptions[Math.floor(Math.random() * x.layerOptions.length)],
            }));

            return new Map(groupLayerOptions.map(x => [x.groupName, x.layerName]));
        };

        const createRandomSampleMaker = (): SampleMaker => {
            const colorMap = {} as { [baseColorKey: string]: RGB };
            const groupLayerSelection = chooseRandomGroupLayers();

            return {
                name: `rand_color_${Math.floor(9999 * Math.random())}`,
                modifyPixel: (baseColor, p, layer) => {
                    if (groupLayerSelection.get(layer.groupName) !== layer.layerName){ return null;}

                    const baseColorKey = getColorKey(baseColor);
                    if (!colorMap[baseColorKey]){
                        colorMap[baseColorKey] = {
                            r: Math.floor(Math.random() * 255),
                            g: Math.floor(Math.random() * 255),
                            b: Math.floor(Math.random() * 255),
                        };
                    }
                    const newBaseColor = colorMap[baseColorKey];
                    return ({
                        r: Math.max(0, Math.min(255, p.r - baseColor.r + newBaseColor.r)),
                        g: Math.max(0, Math.min(255, p.g - baseColor.g + newBaseColor.g)),
                        b: Math.max(0, Math.min(255, p.b - baseColor.b + newBaseColor.b)),
                    });
                },
            };
        };
        const createRandomSampleMaker_delta = (): SampleMaker => {
            const colorMap = {} as { [baseColorKey: string]: RGB };
            const groupLayerSelection = chooseRandomGroupLayers();

            return {
                name: `random_delta_${Math.floor(9999 * Math.random())}`,
                modifyPixel: (baseColor, p, layer) => {
                    if (groupLayerSelection.get(layer.groupName) !== layer.layerName){ return null;}

                    const baseColorKey = getColorKey(baseColor);
                    if (!colorMap[baseColorKey]){
                        colorMap[baseColorKey] = {
                            r: baseColor.r + 50 - Math.floor(Math.random() * 100),
                            g: baseColor.g + 50 - Math.floor(Math.random() * 100),
                            b: baseColor.b + 50 - Math.floor(Math.random() * 100),
                        };
                    }
                    const newBaseColor = colorMap[baseColorKey];
                    return ({
                        r: Math.max(0, Math.min(255, p.r - baseColor.r + newBaseColor.r)),
                        g: Math.max(0, Math.min(255, p.g - baseColor.g + newBaseColor.g)),
                        b: Math.max(0, Math.min(255, p.b - baseColor.b + newBaseColor.b)),
                    });
                },
            };
        };
        // const createRandomSampleMaker_drop = (): SampleMaker => {
        //     const colorMap = {} as { [baseColorKey: string]: RGB|'drop' };
        //     const groupLayerSelection = chooseRandomGroupLayers();

        //     return {
        //         name: `random_missing_${Math.floor(9999 * Math.random())}`,
        //         modifyPixel: (baseColor, p, layer) => {
        //             const baseColorKey = getColorKey(baseColor);
        //             if (!colorMap[baseColorKey]){
        //                 colorMap[baseColorKey] = {
        //                     r: baseColor.r + 50 - Math.floor(Math.random() * 100),
        //                     g: baseColor.g + 50 - Math.floor(Math.random() * 100),
        //                     b: baseColor.b + 50 - Math.floor(Math.random() * 100),
        //                 };

        //                 if (layer.layerIndex > 0 && Math.random() < 0.25){
        //                     colorMap[baseColorKey] = `drop`;
        //                 }
        //             }
        //             const newBaseColor = colorMap[baseColorKey];
        //             if (newBaseColor === `drop`){
        //                 return null;
        //             }
        //             return ({
        //                 r: Math.max(0, Math.min(255, p.r - baseColor.r + newBaseColor.r)),
        //                 g: Math.max(0, Math.min(255, p.g - baseColor.g + newBaseColor.g)),
        //                 b: Math.max(0, Math.min(255, p.b - baseColor.b + newBaseColor.b)),
        //             });
        //         },
        //     };
        // };

        const sampleMakers: SampleMaker[] = [
            { name: `image`, modifyPixel: (baseColor, p) => p },
            { name: `parts`, modifyPixel: (baseColor, p) => baseColor },
            {
                name: `delta`, modifyPixel: (baseColor, p) => ({
                    r: Math.max(0, Math.min(255, 128 + p.r - baseColor.r)),
                    g: Math.max(0, Math.min(255, 128 + p.g - baseColor.g)),
                    b: Math.max(0, Math.min(255, 128 + p.b - baseColor.b)),
                }),
            },
            ...[... new Array(36)].map(() => createRandomSampleMaker()),
            ...[... new Array(36)].map(() => createRandomSampleMaker_delta()),
            //...[... new Array(12)].map(() => createRandomSampleMaker_drop()),
        ];
        for (const sampleMaker of sampleMakers){
            const mergedFilePath = sourceDir.replace(/\\/g, `/`).replace(`/xcf`, `/samples`) + `-` + sampleMaker.name + `.png`;

            console.log(`processImageLayerFiles - Debug - Save Image Merged File`, { mergedFilePath });

            const bottomImage = layerImageSegments[0].imageSegments[0].imageData;
            const { width, height } = bottomImage;
            const SCALE = 8;

            const mergedData = new Uint8ClampedArray(bottomImage.data.length * SCALE * SCALE);

            for (const l of layerImageSegments){
                for (const s of l.imageSegments){
                    const data = s.imageData.data;

                    for (let i = 0; i < width; i++){
                        for (let j = 0; j < height; j++){
                            const sourceIndex = (i + j * width) * 4;
                            if (data[sourceIndex + 3] < 255){ continue; }

                            const p = sampleMaker.modifyPixel(s.baseColor, {
                                r: data[sourceIndex + 0],
                                g: data[sourceIndex + 1],
                                b: data[sourceIndex + 2],
                            }, l.layer);

                            if (!p){ continue; }

                            for (let i2 = 0; i2 < SCALE; i2++){
                                for (let j2 = 0; j2 < SCALE; j2++){
                                    const destIndex = ((i * SCALE + i2) + (j * SCALE + j2) * width * SCALE) * 4;

                                    mergedData[destIndex + 0] = p.r;
                                    mergedData[destIndex + 1] = p.g;
                                    mergedData[destIndex + 2] = p.b;
                                    mergedData[destIndex + 3] = 255;
                                }
                            }
                        }
                    }
                }
            }

            await fs.mkdir(path.dirname(mergedFilePath), { recursive: true });
            await saveImageFile(mergedFilePath, {
                data: mergedData,
                width: width * SCALE,
                height: height * SCALE,
            }, `png`);
        }
    }

};
