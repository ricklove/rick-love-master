/* eslint-disable @typescript-eslint/no-explicit-any */
import { decodeJsonRpcRequestBody, encodeJsonRpcResponseData } from './json-body';

export const createJsonRpcServer = (config: {}, api: { [method: string]: (params: any) => Promise<any> }): { requestHandler: (request: { requestBody: string }) => Promise<{ responseBody: string }> } => {
    const handler = async (request: { requestBody: string }): Promise<{ responseBody: string }> => {
        const data = decodeJsonRpcRequestBody(JSON.parse(request.requestBody));
        const result = await api[data.method](data.params);
        const responseData = encodeJsonRpcResponseData(data.id, result);
        const responseBody = JSON.stringify(responseData);
        return { responseBody };
    };
    return { requestHandler: handler };
};
