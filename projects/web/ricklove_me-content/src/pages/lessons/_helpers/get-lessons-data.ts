import { generateLessonFiles } from '@ricklove/code-training-lesson-build';
import { delay } from '@ricklove/utils-core';
import { joinPathNormalized } from '@ricklove/utils-files';
import { getMonoRepoRoot, getWebProjectPath } from '../../../components/paths';
import { LessonWebData } from './types';

const getPaths = async () => {
  const monoRepoRoot = await getMonoRepoRoot();
  const webProjectPath = await getWebProjectPath();

  const lessonModulesSourceDir = joinPathNormalized(monoRepoRoot, `./projects/code-training/lessons/lesson-modules`);
  const publicPath = joinPathNormalized(webProjectPath, `./public`);
  const publicLessonsRelativePath = `lessons`;
  const publicLessonFilesRelativePath = `_media/lessons`;
  const publicLesosnFilesPath = joinPathNormalized(publicPath, publicLessonFilesRelativePath);

  return {
    lessonModulesSourceDir,
    publicPath,
    publicLessonsRelativePath,
    publicLessonFilesRelativePath,
    publicLesosnFilesPath,
  };
};

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

    const { lessonModulesSourceDir, publicLessonsRelativePath, publicLessonFilesRelativePath, publicLesosnFilesPath } =
      await getPaths();

    const result = await generateLessonFiles({
      lessonModulesSourceDir: lessonModulesSourceDir,
      publicDestDir: publicLesosnFilesPath,
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
