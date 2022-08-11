import { WebRequestType } from '@ricklove/utils-core';
import { LessonApiConfig } from './lesson-api-config';
import { LessonServerApi } from './lesson-api-types';

export const createLessonApiClient = ({
  config,
  webRequest,
}: {
  config: LessonApiConfig;
  webRequest: WebRequestType;
}): LessonServerApi => {
  const request = async <T, TResponse>(endpoint: string, data: T): Promise<TResponse> => {
    return await webRequest(config.lessonApiUrl, { endpoint, data }, { method: `POST`, timeoutMs: 30000 });
  };

  const client: LessonServerApi = {
    getLessonModules: async (data) => await request(`getLessonModules`, data),
    getLessonModule: async (data) => await request(`getLessonModule`, data),
    setLessonModule: async (data) => await request(`setLessonModule`, data),
    buildLessonModule: async (data) => await request(`buildLessonModule`, data),
    deleteLessonModule: async (data) => await request(`deleteLessonModule`, data),
    setProjectState: async (data) => await request(`setProjectState`, data),
  };
  return client;
};