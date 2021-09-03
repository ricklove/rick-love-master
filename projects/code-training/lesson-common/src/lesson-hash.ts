import { hashCode } from '@ricklove/utils-core';
import { LessonProjectState, LessonProjectStateFilesHashCode } from './lesson-types';

export const calculateFilesHashCode = (files: LessonProjectState['files']): LessonProjectStateFilesHashCode => {
  const allText = files.map((x) => `${x.content}:${x.path}:${x.language}::`).join(``);
  return `${hashCode(allText)}` as LessonProjectStateFilesHashCode;
};
