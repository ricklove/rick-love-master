import AWS from 'aws-sdk';
import { shuffle } from 'utils/arrays';
import { toKeyValueObject } from 'utils/objects';
import { doodleStoragePaths } from '../doodle-paths';
import { DoodleUserDrawingDataJson, DoodleUserVotesDataJson, DoodleSummaryDataJson } from '../doodle';

const s3 = new AWS.S3({ signatureVersion: `v4` });

const settings = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bucket: process.env.BUCKET!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    serverStateBucket: process.env.SERVERSTATEBUCKET!,
};

const getJsonObject = async <T>(bucket: string, key: string): Promise<null | T> => {
    const result = await s3.getObject({
        Bucket: bucket,
        Key: key,
    }).promise();

    if (!result) { return null; }

    try {
        return JSON.parse((`${result.Body ?? `NULL!{}`}`)) as T;
    } catch{
        return null;
    }
};
const setJsonObject = async <T>(bucket: string, key: string, value: T): Promise<void> => {
    await s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(value),
        // ContentType: `application/json`,
    }).promise();
};

const processAllObjects = async <T>(
    bucket: string,
    prefix: string,
    shouldProcess: (itemInfo: { key: string, lastModifiedTimestamp: number }) => boolean,
    processItem: (item: T, itemInfo: { key: string, lastModifiedTimestamp: number }) => Promise<void>,
): Promise<void> => {
    let results = await s3.listObjectsV2({
        Bucket: bucket,
        Prefix: prefix,
    }).promise();

    const processResults = async () => {
        const itemInfos = results.Contents?.map(x => ({ key: x.Key ?? ``, lastModifiedTimestamp: x.LastModified?.getTime() ?? 0 })) ?? [];
        const itemsToProcess = itemInfos.filter(x => shouldProcess(x));
        await Promise.all(itemsToProcess.map(async (x) => {
            const obj = await getJsonObject<T>(bucket, x.key ?? ``);
            if (!obj) { return; }
            await processItem(obj, x);
        }));
    };

    await processResults();

    while (results.IsTruncated) {
        // eslint-disable-next-line no-await-in-loop
        results = await s3.listObjectsV2({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: results.NextContinuationToken,
        }).promise();
        // eslint-disable-next-line no-await-in-loop
        await processResults();
    }
};

export const handleDoodleTask = async () => {

    // Get Task State
    type TaskStateData = {
        lastRunTimestamp: number;
        doodleScores: { [key: string]: number };
        doodlePrompts: { [prompt: string]: string[] };
        doodleSources: { [bucketKey: string]: string[] };
    };

    const TASK_STATE_KEY = `doodleTaskState`;
    const taskState: TaskStateData = await getJsonObject<TaskStateData>(settings.serverStateBucket, TASK_STATE_KEY) ?? {
        lastRunTimestamp: 0,
        doodleScores: {},
        doodlePrompts: {},
        doodleSources: {},
    };

    // Update all scores from votes
    await processAllObjects<DoodleUserVotesDataJson>(settings.bucket, doodleStoragePaths.doodleVotesPrefix, x => x.lastModifiedTimestamp > taskState.lastRunTimestamp, async jsonObj => {
        const { doodleVotes } = jsonObj;
        doodleVotes.forEach(x => {
            if (x.t <= taskState.lastRunTimestamp) { return; }
            taskState.doodleScores[x.k] = (taskState.doodleScores[x.k] ?? 0) + 1;
        });
    });

    // Update doodles
    await processAllObjects<DoodleUserDrawingDataJson>(settings.bucket, doodleStoragePaths.doodleVotesPrefix, x => x.lastModifiedTimestamp > taskState.lastRunTimestamp, async (jsonObj, itemInfo) => {
        const { doodles } = jsonObj;
        doodles.forEach(x => {
            if (x.t <= taskState.lastRunTimestamp) { return; }
            taskState.doodleScores[x.k] = 0;
            taskState.doodlePrompts[x.p] = taskState.doodlePrompts[x.p] ?? [];
            taskState.doodlePrompts[x.p].push(x.k);

            taskState.doodleSources[itemInfo.key] = taskState.doodleSources[itemInfo.key] ?? [];
            taskState.doodleSources[itemInfo.key].push(x.k);

        });
    });

    // Create Summary File (choose 4 best doodles & 4 random doodles for each prompt and copy into a single file for client usage)
    // TODO: moderation, etc.
    const doodlePromptsSelected = Object.keys(taskState.doodlePrompts).map(p => {
        const d = taskState.doodlePrompts[p].map(doodleKey => ({ doodleKey, score: taskState.doodleScores[doodleKey] }));
        d.sort((a, b) => -(a.score - b.score));
        const best = d.slice(0, 4);
        const others = shuffle(d.slice(4)).slice(0, 4);
        return { prompt: p, doodles: [...best, ...others] };
    });
    const doodlesIncluded = doodlePromptsSelected.flatMap(x => x.doodles);
    const doodleKeysIncluded = toKeyValueObject(doodlesIncluded.map(x => ({ key: x.doodleKey, value: true })));

    // Combine all doodle drawings and scores
    const doodleData: DoodleSummaryDataJson = { doodles: [] };

    for (const bucketKey of Object.keys(taskState.doodleSources)) {
        // Skip if none includede
        const doodleKeys = taskState.doodleSources[bucketKey];
        if (!doodleKeys.some(x => doodleKeysIncluded[x])) { continue; }

        // eslint-disable-next-line no-await-in-loop
        const d = await getJsonObject<DoodleUserDrawingDataJson>(settings.bucket, bucketKey);
        if (!d) { continue; }
        for (const doodle of d.doodles) {
            if (!doodleKeysIncluded[doodle.k]) { continue; }
            doodleData.doodles.push({
                ...doodle,
                s: taskState.doodleScores[doodle.k],
            });
        }
    }

    // Save doodle summary
    await setJsonObject(settings.bucket, doodleStoragePaths.doodleSummary, JSON.stringify(doodleData));

    // Save state
    taskState.lastRunTimestamp = Date.now();
    await setJsonObject(settings.serverStateBucket, TASK_STATE_KEY, taskState);
};
