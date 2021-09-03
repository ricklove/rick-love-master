import { LessonModule, LessonProjectState } from '@ricklove/code-training-lesson-common';

export type LessonModuleMeta = {
  key: string;
  title: string;
};
export type LessonServerApi = {
  getLessonModules: (data: {}) => Promise<{ data: LessonModuleMeta[] }>;
  getLessonModule: (data: { key: string }) => Promise<{ data: LessonModule }>;
  setLessonModule: (data: { value: LessonModule }) => Promise<{ data: LessonModuleMeta }>;
  buildLessonModule: (data: { key: string }) => Promise<{}>;
  deleteLessonModule: (data: { key: string }) => Promise<{ data: {} }>;

  setProjectState: (data: { projectState: LessonProjectState }) => Promise<{ data: {} }>;
};
