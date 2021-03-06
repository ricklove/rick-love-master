import { randomItem } from 'utils/random';
import { shuffle, distinct_key } from 'utils/arrays';
import { UploadUrl } from 'upload-api/client/types';
import { uploadApiConfig } from 'upload-api/client/config';
import { createSmartUploader, downloadData } from 'upload-api/client/uploader';
import { toKeyValueArray } from 'utils/objects';
import { createUploadApiWebClient } from 'upload-api/client/web-client';
import { DoodleDrawingStorageService, DoodleData, decodeDoodleDrawing, encodeDoodleDrawing, DoodleScoreVote, DoodleScore, DoodleUserDrawingDataJson, DoodleUserVotesDataJson, DoodleSummaryDataJson } from './doodle';
import { doodleStoragePaths } from './doodle-paths';

type DoodleStorageData = {
    doodleUploadUrl?: UploadUrl;
    scoresUploadUrl?: UploadUrl;
};

const storageAccess = {
    load: (): null | DoodleStorageData => {
        try {
            return JSON.parse(localStorage.getItem(`doodleStorage.v2`) ?? `NULL!{}`);
        } catch{ return null; }
    },
    save: (value: DoodleStorageData) => {
        localStorage.setItem(`doodleStorage.v2`, JSON.stringify(value));
    },
};


export const createDoodleDrawingStorageService = async () => {

    const remoteDoodle = createSmartUploader<DoodleUserDrawingDataJson>({
        getUploadUrl: async () => storageAccess.load()?.doodleUploadUrl ?? null,
        setUploadUrl: async (x) => storageAccess.save({ ...(storageAccess.load() ?? {}), doodleUploadUrl: x }),
        uploadApiUrl: uploadApiConfig.uploadApiUrl,
        uploadUrlPrefix: doodleStoragePaths.doodleDrawingsPrefix,
    });
    const remoteVotes = createSmartUploader<DoodleUserVotesDataJson>({
        getUploadUrl: async () => storageAccess.load()?.scoresUploadUrl ?? null,
        setUploadUrl: async (x) => storageAccess.save({ ...(storageAccess.load() ?? {}), scoresUploadUrl: x }),
        uploadApiUrl: uploadApiConfig.uploadApiUrl,
        uploadUrlPrefix: doodleStoragePaths.doodleVotesPrefix,
    });

    const getSummaryData = async () => {
        try {
            let uploadUrl = storageAccess.load()?.doodleUploadUrl;

            if (!uploadUrl) {
                const uploadApiWebClient = createUploadApiWebClient(uploadApiConfig);
                uploadUrl = (await uploadApiWebClient.createUploadUrl({})).uploadUrl;
            }

            const serverUrl = uploadUrl?.getUrl.replace(uploadUrl.relativePath, ``);
            const summaryUrl = `${serverUrl}${doodleStoragePaths.doodleSummary}`;
            console.log(`getSummaryData`, { uploadUrl, serverUrl, summaryUrl });

            const summaryDataRaw = await downloadData(summaryUrl) as DoodleSummaryDataJson;
            const summaryData = {
                doodles: summaryDataRaw.doodles.map(x => ({
                    key: x.k,
                    prompt: x.p,
                    timestamp: x.t,
                    drawing: decodeDoodleDrawing(x.d),
                    score: x.s,
                })),
            };
            return summaryData;
        } catch{
            return { doodles: [] };
        }
    };
    const summaryData = await getSummaryData();

    const memory = {
        doodles: [] as DoodleData[],
        doodleScores: [] as DoodleScore[],
        doodleVotes: [] as DoodleScoreVote[],
    };


    // Load from server
    memory.doodles = (await remoteDoodle.load())?.doodles.map(x => ({
        key: x.k,
        prompt: x.p,
        timestamp: x.t,
        drawing: x.d ? decodeDoodleDrawing(x.d) : (x as unknown as DoodleData).drawing,
    })) ?? [];
    memory.doodleVotes = (await remoteVotes.load())?.doodleVotes ?? [];

    const voteTotals = {} as { [key: string]: number };
    // memory.doodleVotes.forEach(x => { voteTotals[x.k] = (voteTotals[x.k] ?? 0) + 1; });
    summaryData.doodles.forEach(x => { voteTotals[x.key] = (voteTotals[x.key] ?? 0) + x.score; });
    memory.doodleScores = toKeyValueArray(voteTotals).map(x => ({
        doodleKey: x.key,
        score: x.value,
    }));

    const service: DoodleDrawingStorageService = {
        saveDrawing: async (prompt, drawing) => {
            const doodle = { key: `${prompt.substr(0, 8)}:${Date.now()}:${Math.floor(Math.random() * 999999)}`, drawing, prompt, timestamp: Date.now() };
            memory.doodles.push(doodle);

            // Save to server
            setTimeout(async () => {
                await remoteDoodle.save({
                    doodles: memory.doodles.map(x => ({
                        k: x.key,
                        p: x.prompt,
                        t: x.timestamp,
                        d: encodeDoodleDrawing(x.drawing),
                    })),
                });
            });
        },
        saveBestDrawingSelection: async (doodle) => {
            memory.doodleVotes.push({
                k: doodle.key,
                t: Date.now(),
            });

            let d = memory.doodleScores.find(x => x.doodleKey === doodle.key);
            if (!d) {
                d = {
                    doodleKey: doodle.key,
                    score: 0,
                };
                memory.doodleScores.push(d);
            }
            d.score = (d.score ?? 0) + 1;

            // Save to server
            setTimeout(async () => {
                await remoteVotes.save({
                    doodleVotes: memory.doodleVotes,
                });
            });
        },
        getDrawings: async (prompt, options) => {
            const {
                includeOtherPrompts = false,
                maxCount = 4,
            } = options ?? {};

            const allDoodles = distinct_key([...summaryData.doodles, ...memory.doodles.map(x => ({ ...x, score: memory.doodleScores.find(s => s.doodleKey === x.key)?.score ?? 0 }))], x => x.key);

            const samePromptDrawings = allDoodles.filter(x => x.prompt === prompt).sort((a, b) => -(a.score - b.score));
            console.log(`getDrawings`, { samePromptDrawings });

            const otherPromptDrawings = includeOtherPrompts ? allDoodles.filter(x => x.prompt !== prompt) : [];
            const allDrawings =
                includeOtherPrompts ? [randomItem(samePromptDrawings), ...shuffle(otherPromptDrawings).slice(0, maxCount - 1)]
                    : samePromptDrawings;
            const drawings = shuffle(allDrawings).slice(0, maxCount);
            return { doodles: drawings };
        },
        getAllDrawings: async () => {
            const allDoodles = distinct_key([...summaryData.doodles, ...memory.doodles.map(x => ({ ...x, score: memory.doodleScores.find(s => s.doodleKey === x.key)?.score ?? 0 }))], x => x.key);
            return { doodles: allDoodles };
        },
    };

    return service;
};
