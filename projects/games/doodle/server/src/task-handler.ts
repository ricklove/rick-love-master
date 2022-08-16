import AWS from 'aws-sdk';
import {
  doodleStoragePaths,
  DoodleSummaryDataJson,
  DoodleUserDrawingDataJson,
  DoodleUserVotesDataJson,
} from '@ricklove/doodle-common';
import { shuffle, toKeyValueObject } from '@ricklove/utils-core';

const s3 = new AWS.S3({ signatureVersion: `v4` });

const settings = {
  bucket: process.env.BUCKET!,
  serverStateBucket: process.env.SERVERSTATEBUCKET!,
};

const getObjectJsonData = async <T>(bucket: string, key: string): Promise<null | T> => {
  try {
    const result = await s3
      .getObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();
    if (!result) {
      return null;
    }

    return JSON.parse(`${result.Body ?? `NULL!{}`}`) as T;
  } catch {
    return null;
  }
};
const setObjectJsonData = async <T>(bucket: string, key: string, value: T): Promise<void> => {
  await s3
    .putObject({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(value),
      // ContentType: `application/json`,
    })
    .promise();
};

const processAllObjects = async <T>(
  bucket: string,
  prefix: string,
  shouldProcess: (itemInfo: { key: string; lastModifiedTimestamp: number }) => boolean,
  processItem: (item: T, itemInfo: { key: string; lastModifiedTimestamp: number }) => Promise<void>,
): Promise<void> => {
  console.log(`processAllObjects - listObjectsV2`);
  let results = await s3
    .listObjectsV2({
      Bucket: bucket,
      Prefix: prefix,
    })
    .promise();

  const processResults = async () => {
    console.log(`processAllObjects.processResults`, {
      bucket,
      prefix,
      length: results.Contents?.length,
      keyCount: results.KeyCount,
    });

    const itemInfos =
      results.Contents?.map((x) => ({ key: x.Key ?? ``, lastModifiedTimestamp: x.LastModified?.getTime() ?? 0 })) ?? [];
    const itemsToProcess = itemInfos.filter((x) => shouldProcess(x));
    await Promise.all(
      itemsToProcess.map(async (x) => {
        const obj = await getObjectJsonData<T>(bucket, x.key ?? ``);
        if (!obj) {
          return;
        }
        await processItem(obj, x);
      }),
    );
  };

  await processResults();

  while (results.IsTruncated) {
    console.log(`processAllObjects - listObjectsV2 (NextContinuationToken)`);

    // eslint-disable-next-line require-atomic-updates
    results = await s3
      .listObjectsV2({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: results.NextContinuationToken,
      })
      .promise();

    await processResults();
  }
};

/** Index doodles, tally votes, create doodle summary file, etc. */
export const handleDoodleTask = async () => {
  console.log(`handleDoodleTask`);
  const runStartTimestamp = Date.now();

  // Get Task State
  type TaskStateData = {
    lastRunTimestamp: number;
    doodleScores: { [key: string]: number };
    doodlePrompts: { [prompt: string]: string[] };
    doodleSources: { [bucketKey: string]: string[] };
  };

  // Get Task State
  console.log(`handleDoodleTask - get task state`);
  const TASK_STATE_KEY = `doodleTaskState`;
  const taskState: TaskStateData = (await getObjectJsonData<TaskStateData>(
    settings.serverStateBucket,
    TASK_STATE_KEY,
  )) ?? {
    lastRunTimestamp: 0,
    doodleScores: {},
    doodlePrompts: {},
    doodleSources: {},
  };

  // Update all scores from votes
  console.log(`handleDoodleTask - processAllObjects - votes`);
  await processAllObjects<{ data: DoodleUserVotesDataJson }>(
    settings.bucket,
    `${doodleStoragePaths.doodleVotesPrefix}/`,
    (x) => x.lastModifiedTimestamp > taskState.lastRunTimestamp,
    async (jsonObj) => {
      const { doodleVotes } = jsonObj.data;
      doodleVotes.forEach((x) => {
        if (x.t <= taskState.lastRunTimestamp || x.t > runStartTimestamp) {
          return;
        }

        taskState.doodleScores[x.k] = (taskState.doodleScores[x.k] ?? 0) + 1;
      });
    },
  );

  // Update doodles
  console.log(`handleDoodleTask - processAllObjects - doodles`);
  await processAllObjects<{ data: DoodleUserDrawingDataJson }>(
    settings.bucket,
    `${doodleStoragePaths.doodleDrawingsPrefix}/`,
    (x) => x.lastModifiedTimestamp > taskState.lastRunTimestamp,
    async (jsonObj, itemInfo) => {
      const { doodles } = jsonObj.data;
      doodles.forEach((x) => {
        if (x.t <= taskState.lastRunTimestamp || x.t > runStartTimestamp) {
          return;
        }

        taskState.doodleScores[x.k] = 0;
        taskState.doodlePrompts[x.p] = taskState.doodlePrompts[x.p] ?? [];
        taskState.doodlePrompts[x.p].push(x.k);

        taskState.doodleSources[itemInfo.key] = taskState.doodleSources[itemInfo.key] ?? [];
        taskState.doodleSources[itemInfo.key].push(x.k);
      });
    },
  );

  // Create Summary File (choose 4 best doodles & 4 random doodles for each prompt and copy into a single file for client usage)
  console.log(`handleDoodleTask - create Summary File`);

  // TODO: moderation, etc.
  const doodlePromptsSelected = Object.keys(taskState.doodlePrompts).map((p) => {
    const d = taskState.doodlePrompts[p].map((doodleKey) => ({ doodleKey, score: taskState.doodleScores[doodleKey] }));
    d.sort((a, b) => -(a.score - b.score));
    const best = d.slice(0, 4);
    const others = shuffle(d.slice(4)).slice(0, 4);
    return { prompt: p, doodles: [...best, ...others] };
  });
  const doodlesIncluded = doodlePromptsSelected.flatMap((x) => x.doodles);
  const doodleKeysIncluded = toKeyValueObject(doodlesIncluded.map((x) => ({ key: x.doodleKey, value: true })));

  // Combine all doodle drawings and scores
  const doodleData: DoodleSummaryDataJson = { doodles: [] };

  for (const bucketKey of Object.keys(taskState.doodleSources)) {
    // Skip if none included
    const doodleKeys = taskState.doodleSources[bucketKey];
    if (!doodleKeys.some((x) => doodleKeysIncluded[x])) {
      continue;
    }

    const d = await getObjectJsonData<{ data: DoodleUserDrawingDataJson }>(settings.bucket, bucketKey);
    if (!d) {
      continue;
    }
    for (const doodle of d.data.doodles) {
      if (!doodleKeysIncluded[doodle.k]) {
        continue;
      }
      doodleData.doodles.push({
        ...doodle,
        s: taskState.doodleScores[doodle.k],
      });
    }
  }

  // Save doodle summary
  console.log(`handleDoodleTask - save summary`);
  await setObjectJsonData(settings.bucket, doodleStoragePaths.doodleSummary, { data: doodleData });

  // Save state
  console.log(`handleDoodleTask - save task state`);
  // eslint-disable-next-line require-atomic-updates
  taskState.lastRunTimestamp = runStartTimestamp;
  await setObjectJsonData(settings.serverStateBucket, TASK_STATE_KEY, taskState);
};
