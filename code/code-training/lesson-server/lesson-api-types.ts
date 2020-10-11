import { ApiError } from 'utils/error';
import { LessonModule } from '../common/lesson-types';

export type LessonModuleMeta = {
    key: string;
    title: string;
};
export type LessonServerApi = {
    getLessonModules: (data: {}) => Promise<{ data: LessonModuleMeta[] }>;
    getLessonModule: (data: { key: string }) => Promise<{ data: LessonModule }>;
    setLessonModule: (data: { value: LessonModule }) => Promise<{ data: LessonModuleMeta }>;
    deleteLessonModule: (data: { key: string }) => Promise<{ data: {} }>;
};
