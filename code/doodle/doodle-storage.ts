import { randomItem } from 'utils/random';
import { shuffle } from 'utils/arrays';
import { UploadUrl } from 'upload-api/client/types';
import { createUploadApiWebClient } from 'upload-api/client/web-client';
import { uploadApiConfig } from 'upload-api/client/config';
import { createUploader, downloadData } from 'upload-api/client/uploader';
import { DoodleDrawingStorageService, DoodleData_Encoded, DoodleData, decodeDoodleDrawing, DoodleDrawingEncoded, DoodleDrawing, encodeDoodleDrawing } from './doodle';

type DoodleStorageData = {
    // doodles: DoodleData[];
    uploadUrl: UploadUrl;
};
type DoodleUploadData = {
    doodles: DoodleData_Encoded[];
};
const storageAccess = {
    load: (): null | DoodleStorageData => {
        try {
            return JSON.parse(localStorage.getItem(`doodleStorage`) ?? `NULL!{}`);
        } catch{ return null; }
    },
    save: (value: DoodleStorageData) => {
        localStorage.setItem(`doodleStorage`, JSON.stringify(value));
    },
};

const createRemoteDoodleAccess = () => {
    const uploadApiWebClient = createUploadApiWebClient(uploadApiConfig);

    const storageData = storageAccess.load();
    let uploadUrl = storageData?.uploadUrl ?? null;

    return {
        load: async (): Promise<DoodleUploadData> => {
            if (!uploadUrl) {
                return { doodles: [] };
            }

            const data = await downloadData(uploadUrl.getUrl);
            return data as DoodleUploadData;
        },
        save: async (data: DoodleUploadData) => {
            if (!uploadUrl) {
                uploadUrl = (await uploadApiWebClient.createUploadUrl({ prefix: `doodle` })).uploadUrl;
                storageAccess.save({ uploadUrl });
            }

            try {
                const uploader = createUploader(uploadUrl);
                await uploader.uploadData(data);
            } catch{
                // Try again after renew upload token
                uploadUrl = (await uploadApiWebClient.renewUploadUrl({ uploadUrl })).uploadUrl;
                storageAccess.save({ uploadUrl });

                const uploader = createUploader(uploadUrl);
                await uploader.uploadData(data);
            }

            // Upload backup (temp)
            const backupUrl = (await uploadApiWebClient.createUploadUrl({ prefix: `${uploadUrl.relativePath}/backup` })).uploadUrl;
            const backupUploader = createUploader(backupUrl);
            await backupUploader.uploadData(data);
        },
    };
};

export const createDoodleDrawingStorageService = async () => {
    const remote = createRemoteDoodleAccess();

    const memory = {
        doodles: [] as DoodleData[],
    };

    // Load from server
    memory.doodles = (await remote.load()).doodles.map(x => ({
        ...x,
        drawing: x.drawingEncoded ? decodeDoodleDrawing(x.drawingEncoded) : (x as unknown as DoodleData).drawing,
    }));

    const service: DoodleDrawingStorageService = {
        saveDrawing: async (prompt, drawing) => {
            const doodle = { key: `${prompt.substr(0, 8)}:${Date.now()}:${Math.floor(Math.random() * 999999)}`, drawing, prompt };
            memory.doodles.push(doodle);

            // Save to server
            setTimeout(async () => {
                await remote.save({ doodles: memory.doodles.map(x => ({ ...x, drawing: undefined, drawingEncoded: encodeDoodleDrawing(x.drawing) })) });
            });
        },
        saveBestDrawingSelection: async (doodle) => {
            const d = memory.doodles.find(x => x.key === doodle.key);
            if (!d) { return; }
            d.score = (d.score ?? 0) + 1;

            // Save to server
            setTimeout(async () => {
                await remote.save({ doodles: memory.doodles.map(x => ({ ...x, drawing: undefined, drawingEncoded: encodeDoodleDrawing(x.drawing) })) });
            });
        },
        getDrawings: async (prompt, options) => {
            const {
                includeOtherPrompts = false,
                maxCount = 4,
            } = options ?? {};

            const samePromptDrawings = memory.doodles.filter(x => x.prompt === prompt);
            const otherPromptDrawings = includeOtherPrompts ? memory.doodles.filter(x => x.prompt !== prompt) : [];
            const allDrawings =
                includeOtherPrompts ? [randomItem(samePromptDrawings), ...shuffle(otherPromptDrawings).slice(0, maxCount - 1)]
                    : samePromptDrawings;
            const drawings = shuffle(allDrawings).slice(0, maxCount);
            return { doodles: drawings };
        },
    };

    return service;
};
