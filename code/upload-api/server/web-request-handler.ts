import { UploadApiRequestData } from '../client/types';
import { createUploadApi } from './upload-api';

const settings = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bucket: process.env.BUCKET!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    keyBucket: process.env.KEYBUCKET!,
};

export const handleUploadApiWebRequest = async (requestData: UploadApiRequestData) => {
    const { endpoint, data } = requestData;
    // Execute Request
    const appApi = createUploadApi(settings);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await appApi[endpoint](data as any);

    const response = {
        data: result,
    };
    return response;
};
