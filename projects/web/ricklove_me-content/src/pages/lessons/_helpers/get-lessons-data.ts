import { generateLessonFiles } from '@ricklove/code-training-lesson-build';
import { delay } from '@ricklove/utils-core';
import { joinPathNormalized } from '@ricklove/utils-files';
import { getMonoRepoRoot, getWebProjectPath } from '../../../components/paths';
import { LessonWebData } from './types';

const getLessonModulesSourceDir = async () =>
  joinPathNormalized(await getMonoRepoRoot(), `./projects/code-training/lessons/lesson-modules`);
const getPublicPath = async () => joinPathNormalized(await getWebProjectPath(), `./public`);
const publicLessonsRelativePath = `lessons`;
const publicLessonFilesRelativePath = `_media/lessons`;
const getPublicLesosnFilesPath = async () => joinPathNormalized(await getPublicPath(), publicLessonFilesRelativePath);

const cache = {
  working: false,
  data: null as null | {
    lessons: LessonWebData[];
  },
};

export const getLessonsData_cached = async (): Promise<{ lessons: LessonWebData[] }> => {
  while (cache.working) {
    await delay(10);
  }
  cache.working = true;

  try {
    if (cache.data) {
      return cache.data;
    }

    const result = await generateLessonFiles({
      lessonModulesSourceDir: await getLessonModulesSourceDir(),
      publicDestDir: await getPublicLesosnFilesPath(),
      webRoute: publicLessonFilesRelativePath,
    });

    const data = {
      lessons: result.lessonModules
        .map((x) => ({
          key: x.key,
          title: x.title,

          pageUrl: `/${publicLessonsRelativePath}/${x.key}`,
          filesRootUrl: `/${publicLessonFilesRelativePath}/${x.key}`,
        }))
        .map((x) => ({
          ...x,
          jsonUrl: `${x.filesRootUrl}/${x.key}.code-lesson.json`,
          buildRootUrl: `${x.filesRootUrl}/build`,
        })),
    };

    // eslint-disable-next-line require-atomic-updates
    cache.data = data;
    return data;
  } finally {
    // eslint-disable-next-line require-atomic-updates
    cache.working = false;
  }
};
