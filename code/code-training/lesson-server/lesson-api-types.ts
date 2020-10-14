import { LessonModule, LessonProjectState } from '../common/lesson-types';

export type LessonModuleMeta = {
    key: string;
    title: string;
};
export type LessonServerApi = {
    getLessonModules: (data: {}) => Promise<{ data: LessonModuleMeta[] }>;
    getLessonModule: (data: { key: string }) => Promise<{ data: LessonModule }>;
    setLessonModule: (data: { value: LessonModule }) => Promise<{ data: LessonModuleMeta }>;
    deleteLessonModule: (data: { key: string }) => Promise<{ data: {} }>;

    setProjectState: (data: { projectState: LessonProjectState }) => Promise<{ data: {} }>;
};
