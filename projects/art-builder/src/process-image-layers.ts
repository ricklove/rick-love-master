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
        const groupName = fileName.match(/G_([^-]+)-/)?.[1];
        const layerName = fileName.match(/P_([^.]+)./)?.[1];
        const layerIndex = parseInt(fileName.match(/^([^-]+)-/)?.[1] || `0`, 10);

        return {
            filePath: f,
            fileName,
            groupName,
            layerName,
            layerIndex,
        };
    });

    const layerInfos = fileInfos.map(f => {
        const partFile = fileInfos.find(x => x.layerName === f.layerName + `C`);
        const partFilePath = partFile?.filePath;
        return { ...f, partFilePath };
    })
        .filter(x => x.partFilePath)
        .map(x => ({ ...x, partFilePath: x.partFilePath as string }))
    ;


    console.log(`processImageLayerFiles - Extract Image Segments from Layers`, { layerInfos });

    const debug_cloneImages = false;
    if (debug_cloneImages){
        for (const l of layerInfos){
            const files = [
                { filePath: l.filePath, pixels: await loadImageFile(l.filePath) },
                { filePath: l.partFilePath, pixels: await loadImageFile(l.partFilePath) },
            ];

            for (const f of files){
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
        const imagePixels = await loadImageFile(l.filePath);
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
            for (let i = 0; i < partPixels.data.length; i += 4){
                debug_segmentImage.data[i + 0] = imagePixels.data[i + 0];
                debug_segmentImage.data[i + 1] = imagePixels.data[i + 1];
                debug_segmentImage.data[i + 2] = imagePixels.data[i + 2];
                debug_segmentImage.data[i + 3] = imagePixels.data[i + 3];
            }
        }

        // Clone each part
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
            segment.data[i + 0] = imagePixels.data[i + 0];
            segment.data[i + 1] = imagePixels.data[i + 1];
            segment.data[i + 2] = imagePixels.data[i + 2];
            segment.data[i + 3] = 255;
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
                const segmentFilePath = l.layer.filePath.replace(`/xcf`, `/segments`).replace(`.png`, `-${s.baseColorKey}.png`);
                await fs.mkdir(path.dirname(segmentFilePath), { recursive: true });
                await saveImageFile(segmentFilePath, s.imageData, `png`);
            }
        }
    }

    const debug_saveMergedFile = true;
    if (debug_saveMergedFile){
        const mergedFilePath = sourceDir.replace(/\\/g, `/`).replace(`/xcf`, `/merged`) + `.png`;

        console.log(`processImageLayerFiles - Debug - Save Image Merged File`, { mergedFilePath });

        const sampleData = layerImageSegments[0].imageSegments[0].imageData;
        const mergedData = new Uint8ClampedArray(sampleData.data.length);

        for (const l of layerImageSegments.reverse()){
            for (const s of l.imageSegments){
                const data = s.imageData.data;
                for (let i = 0; i < data.length; i += 4){
                    if (data[i + 3] < 255){ continue; }

                    mergedData[i + 0] = data[i + 0];
                    mergedData[i + 1] = data[i + 1];
                    mergedData[i + 2] = data[i + 2];
                    mergedData[i + 3] = 255;
                }
            }
        }

        await fs.mkdir(path.dirname(mergedFilePath), { recursive: true });
        await saveImageFile(mergedFilePath, { ...sampleData, data: mergedData }, `png`);
    }

};
