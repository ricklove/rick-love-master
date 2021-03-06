import { webRequest } from 'utils/web-request';
import { UploadApi, UploadApiEndpointName, UploadApiRequestData } from './types';

export const createUploadApiWebClient = (config: { uploadApiUrl: string }): UploadApi => {

    async function apiRequest<T>(endpoint: UploadApiEndpointName, data: unknown): Promise<T> {
        const url = `${config.uploadApiUrl}/${endpoint}`;

        const requestData: UploadApiRequestData = {
            endpoint,
            data,
        };

        const resultObj = (await webRequest(url, requestData)) as { data: T };

        return resultObj.data;
    };

    const api: UploadApi = {
        createUploadUrl: (data) => apiRequest(`createUploadUrl`, data),
        renewUploadUrl: (data) => apiRequest(`renewUploadUrl`, data),
    };

    return api;
};
