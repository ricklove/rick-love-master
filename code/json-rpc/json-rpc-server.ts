/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsonStringify_safe } from 'utils/json';
import { decodeJsonRpcRequestBody, encodeJsonRpcResponseData, encodeJsonRpcResponseData_error } from './json-body';
import { JsonRpcClientCredentials, JsonRpcError } from './types';

export const createJsonRpcWebServer = (args: {
    verifyAndRefreshCredentials: (credentials: null | JsonRpcClientCredentials) => Promise<null | 'reject' | JsonRpcClientCredentials>;
    createHandler: (credentials: null | JsonRpcClientCredentials) => Promise<{
        api: { [method: string]: (params: any) => Promise<any> };
        getNewCredentials?: (credentials: null | JsonRpcClientCredentials) => Promise<null | 'reject' | JsonRpcClientCredentials>;
    }>;
}): {
    requestHandler: (request: { requestBody: string }) => Promise<{ responseBody: string }>;
} => {
    const handler = async (request: { requestBody: string }): Promise<{ responseBody: string }> => {
        const data = decodeJsonRpcRequestBody(JSON.parse(request.requestBody));
        const verifyResult = await args.verifyAndRefreshCredentials(data.credentials);
        try {
            if (verifyResult === `reject`) {
                throw new JsonRpcError(`Rejected Credentials`);
            }

            const { api, getNewCredentials } = await args.createHandler(data.credentials);
            const result = await api[data.method](data.params);
            const newCredentials = await getNewCredentials?.(data.credentials);
            const responseData = encodeJsonRpcResponseData(data.id, result, newCredentials ?? null);
            const responseBody = JSON.stringify(responseData);
            return { responseBody };
        } catch (error) {
            console.error(`createJsonRpcWebServer`, { error });
            const responseData = encodeJsonRpcResponseData_error(data.id, error, verifyResult);
            const responseBody = jsonStringify_safe(responseData);
            return { responseBody };
        }

    };
    return { requestHandler: handler };
};
