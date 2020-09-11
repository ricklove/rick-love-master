import { fetchWithTimeout } from 'utils/web-request';
import { AppError } from 'utils/error';
import { UploadUrl } from './types';

export const downloadData = async (getUrl: string) => {
    const result = await fetchWithTimeout(getUrl, {
        method: `GET`,
        headers: {
            'Accept': `application/json`,
        },
    });
    const json = await result.json() as { data: unknown };
    return json.data;
};


export const createUploader = (uploadUrl: UploadUrl) => {
    return {
        uploadData: async (data: unknown) => {
            const body = JSON.stringify({ data });
            const result = await fetchWithTimeout(uploadUrl.putUrl, {
                method: `PUT`,
                headers: {
                    'Accept': `application/json`,
                    'Content-Type': `application/json`,
                    'Content-Length': `${body.length}`,
                },
                body,
            });

            if (!result.ok) {
                throw new AppError(`Upload Failed`);
            }
        },
        downloadData: async (): Promise<unknown> => {
            return await downloadData(uploadUrl.getUrl);
        },
    };
};
