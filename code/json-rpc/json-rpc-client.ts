import { toKeyValueObject } from 'utils/objects';
import { webRequest_jsonPost } from './web-request';
import { encodeJsonRpcRequestBody, decodeJsonRpcResponseBody } from './json-body';
import { JsonRpcClientCredentials, JsonRpcError } from './types';

export type JsonRpcClientEndpointNames<T> = { [K in keyof T]: T[K] extends (...args: infer PARAMS) => Promise<infer R> ? K : never };
export type JsonRpcClientEndpoints<T> = { [K in keyof T]: T[K] extends (...args: infer PARAMS) => Promise<infer R> ? (...args: PARAMS) => Promise<R> : never };


export type JsonRpcWebClientCredentialsAccess = {
    getCredentials: () => Promise<JsonRpcClientCredentials>;
    setCredentials: (newCredentials: JsonRpcClientCredentials) => Promise<void>;
    resetCredentials: () => Promise<void>;
};

export const createJsonRpcWebClient = <T>(config: { serverUrl: string, credentialsAccess?: JsonRpcWebClientCredentialsAccess, appendMethodNameToUrl?: boolean }, endpointNames: JsonRpcClientEndpointNames<T>): JsonRpcClientEndpoints<T> => {
    const endpointRequests = Object.keys(endpointNames).map(k => ({
        method: k,
        execute: async (params: unknown) => {
            const data = encodeJsonRpcRequestBody(k, params, await config.credentialsAccess?.getCredentials());
            const url = !config.appendMethodNameToUrl ? config.serverUrl : `${config.serverUrl}/${data.method}`;
            const resultRaw = await webRequest_jsonPost(url, data);
            const result = decodeJsonRpcResponseBody(resultRaw);

            if (result.newCredentials && config.credentialsAccess) {
                if (result.newCredentials === `reject`) {
                    await config.credentialsAccess.resetCredentials();
                } else {
                    await config.credentialsAccess.setCredentials(result.newCredentials);
                }
            }

            if (result.error) {
                throw new JsonRpcError(`JsonRpcClient Request Failed`, { error: result.error });
            }

            return result.result;
        },
    }));

    const endpoints = toKeyValueObject(endpointRequests.map(x => ({ key: x.method, value: x.execute })));
    return endpoints as JsonRpcClientEndpoints<T>;
};
