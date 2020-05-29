import { toKeyValueObject } from 'utils/objects';
import { webRequest_jsonPost } from './web-request';
import { encodeJsonRpcRequestBody, decodeJsonRpcResponseBody } from './json-body';

export type JsonRpcClientEndpointNames<T> = { [K in keyof T]: T[K] extends (...args: infer PARAMS) => Promise<infer R> ? K : never };
export type JsonRpcClientEndpoints<T> = { [K in keyof T]: T[K] extends (...args: infer PARAMS) => Promise<infer R> ? (...args: PARAMS) => Promise<R> : never };
export class JsonRpcError extends Error {
    constructor(public message: string, public data?: unknown, public innerError?: Error) { super(); }
}

export const createJsonRpcClient = <T>(config: { serverUrl: string, appendMethodNameToUrl?: boolean }, endpointNames: JsonRpcClientEndpointNames<T>): JsonRpcClientEndpoints<T> => {
    const endpointRequests = Object.keys(endpointNames).map(k => ({
        method: k,
        execute: async (params: unknown) => {
            const data = encodeJsonRpcRequestBody(k, params);
            const url = !config.appendMethodNameToUrl ? config.serverUrl : `${config.serverUrl}/${data.method}`;
            const resultRaw = await webRequest_jsonPost(url, data);
            const result = decodeJsonRpcResponseBody(resultRaw);
            if (result.error) {
                throw new JsonRpcError(`JsonRpcClient Request Failed`, { error: result.error });
            }
            return result.result;
        },
    }));

    const endpoints = toKeyValueObject(endpointRequests.map(x => ({ key: x.method, value: x.execute })));
    return endpoints as JsonRpcClientEndpoints<T>;
};
