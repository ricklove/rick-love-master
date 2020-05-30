/* eslint-disable @typescript-eslint/no-explicit-any */
import { decodeJsonRpcRequestBody, encodeJsonRpcResponseData, JsonRpcClientCredentials, encodeJsonRpcResponseData_error } from './json-body';

export const createJsonRpcWebServer = (
    createHandler: (credentials: null | JsonRpcClientCredentials) => Promise<{
        api: { [method: string]: (params: any) => Promise<any> };
        getNewCredentials: () => Promise<null | JsonRpcClientCredentials>;
    }>,
): {
    requestHandler: (request: { requestBody: string }) => Promise<{ responseBody: string }>;
} => {
    const handler = async (request: { requestBody: string }): Promise<{ responseBody: string }> => {
        const data = decodeJsonRpcRequestBody(JSON.parse(request.requestBody));
        const { api, getNewCredentials } = await createHandler(data.credentials);
        try {
            const result = await api[data.method](data.params);
            const newCredentials = await getNewCredentials();
            const responseData = encodeJsonRpcResponseData(data.id, result, newCredentials);
            const responseBody = JSON.stringify(responseData);
            return { responseBody };
        } catch (error) {
            const responseData = encodeJsonRpcResponseData_error(data.id, error);
            const responseBody = JSON.stringify(responseData);
            return { responseBody };
        }

    };
    return { requestHandler: handler };
};
