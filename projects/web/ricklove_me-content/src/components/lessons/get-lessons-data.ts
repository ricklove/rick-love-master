import { generateLessonFiles } from '@ricklove/code-training-lesson-build';
import { joinPathNormalized } from '@ricklove/utils-files';
import { LessonWebData } from './types';

const getWebProjectPath = () => process.cwd();
const getLessonModulesSourceDir = () =>
  joinPathNormalized(getWebProjectPath(), `../../../projects/code-training/lessons/lesson-modules`);
const getPublicPath = () => joinPathNormalized(getWebProjectPath(), `./public`);
const publicLessonsRelativePath = `lessons`;
const publicLessonFilesRelativePath = `media/lessons`;
const getPublicLesosnFilesPath = () => joinPathNormalized(getPublicPath(), publicLessonFilesRelativePath);

const cache = {
  data: null as null | {
    lessons: LessonWebData[];
  },
};

export const getLessonsData_cached = async (): Promise<{ lessons: LessonWebData[] }> => {
  if (cache.data) {
    return cache.data;
  }

  const result = await generateLessonFiles({
    lessonModulesSourceDir: getLessonModulesSourceDir(),
    publicDestDir: getPublicLesosnFilesPath(),
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
};
