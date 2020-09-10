import { fetchWithTimeout } from 'utils/web-request';
import { UploadUrl } from './types';

export const createUploader = (uploadUrl: UploadUrl) => {
    return {
        uploadData: async (data: unknown) => {
            const body = JSON.stringify({ data });
            await fetchWithTimeout(uploadUrl.putUrl, {
                method: `PUT`,
                headers: {
                    'Accept': `application/json`,
                    'Content-Type': `application/json`,
                    'Content-Length': `${body.length}`,
                },
                body,
            });
        },
        downloadData: async (): Promise<unknown> => {
            const result = await fetchWithTimeout(uploadUrl.getUrl, {
                method: `GET`,
                headers: {
                    'Accept': `application/json`,
                },
            });
            const json = await result.json() as { data: unknown };
            return json.data;
        },
    };
};
