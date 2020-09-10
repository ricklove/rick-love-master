import { webRequest } from 'utils/web-request';
import { UploadApi, UploadApiEndpointName, UploadApiRequestData } from './types';

export const createUploadApiWebClient = (config: { uploadApiDomain: string }): UploadApi => {

    async function apiRequest<T>(endpoint: UploadApiEndpointName, data: unknown): Promise<T> {
        const url = `${config.uploadApiDomain}/${endpoint}`;

        const requestData: UploadApiRequestData = {
            endpoint,
            data,
        };

        const resultObj = (await webRequest(url, requestData)) as { data: T };

        return resultObj.data;
    };

    const api: UploadApi = {
        createUploadUrl: (data) => apiRequest(`createUploadUrl`, data),
    };

    return api;
};
