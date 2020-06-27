import { toKeyValueObject } from 'utils/objects';
import { delay } from 'utils/delay';
import { JsonRpcCoreClient, JsonRpcApiMethodNames, JsonRpcApiMethods, JsonRpcError, JsonRpcBatchClient, JsonRpcRequestBody, JsonRpcResponseBody, JsonRpcSessionClient, JsonRpcSessionToken, JsonRpcWebClient, JsonRpcSessionResponseBody } from './types';
import { encodeJsonRpcRequestBody, decodeJsonRpcResponseBody } from './json-body';
import { fetchJsonPost } from './web/fetch-request';

const createJsonRpcApiCoreClient = <T>(config: { inner: JsonRpcCoreClient, apiMethodNames: JsonRpcApiMethodNames<T> }): JsonRpcApiMethods<T> => {
    const methodRequests = Object.keys(config.apiMethodNames).map(k => ({
        method: k,
        execute: async (params: unknown) => {
            const data = encodeJsonRpcRequestBody(k, params);
            const response = await config.inner.request(data);
            const result = decodeJsonRpcResponseBody(response);

            if (result.error) {
                throw new JsonRpcError(`JsonRpcClient Request Failed`, { error: result.error });
            }

            return result.result;
        },
    }));

    const methods = toKeyValueObject(methodRequests.map(x => ({ key: x.method, value: x.execute })));
    return methods as JsonRpcApiMethods<T>;
};

const createJsonRpcCoreBatchClient = (config: { inner: JsonRpcBatchClient }): JsonRpcCoreClient => {
    const batchTimeMs = 50;
    let newRequests = [] as {
        data: JsonRpcRequestBody;
        promiseState: {
            _resolve: (value: JsonRpcResponseBody) => void;
            _reject: (value: unknown) => void;
        };
    }[];

    const coreClient: JsonRpcCoreClient = {
        request: async (data) => {
            const promiseState = {
                _resolve: null as null | ((value: JsonRpcResponseBody) => void),
                _reject: null as null | ((value: unknown) => void),
            };
            const prom = new Promise<JsonRpcResponseBody>((resolve, reject) => {
                promiseState._resolve = resolve;
                promiseState._reject = reject;
            });

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            newRequests.push({ data, promiseState: { _resolve: promiseState._resolve!, _reject: promiseState._reject! } });
            await delay(batchTimeMs);
            if (newRequests.length <= 0) { return prom; }

            const batchRequests = newRequests;
            newRequests = [];

            const result = await (async () => {
                try {
                    return {
                        batchResponses: await config.inner.batchRequest(batchRequests.map(x => x.data)),
                    };
                } catch (error) {
                    return {
                        error,
                    };
                }
            })();

            if (result.error) {
                batchRequests.forEach(req => {
                    req.promiseState._reject(new JsonRpcError(`Request Failed`, { request: req.data, batchRequests }));
                });
                return prom;
            }
            for (const req of batchRequests) {
                const { batchResponses } = result;
                const res = batchResponses?.find(x => x.id === req.data.id);
                if (!res) {
                    req.promiseState._reject(new JsonRpcError(`Batch Response is Missing`, { request: req.data, batchRequests, batchResponses }));
                    // throw new JsonRpcError(`Batch Response is Missing`, { request: req.data, batchRequests, batchResponses });
                    continue;
                }
                req.promiseState._resolve(res);
            }

            return prom;
        },
    };
    return coreClient;
};

export type JsonRpcSessionStorage = {
    getSessionToken: () => Promise<JsonRpcSessionToken>;
    setSessionToken: (sessionToken: JsonRpcSessionToken) => Promise<void>;
    resetSessionToken: () => Promise<void>;
};
const createJsonRpcBatchSessionClient = (config: { inner: JsonRpcSessionClient, sessionTokenStorage?: JsonRpcSessionStorage }): JsonRpcBatchClient => {
    const batchClient: JsonRpcBatchClient = {
        batchRequest: async (batchData) => {
            const sessionToken = await config.sessionTokenStorage?.getSessionToken();
            const response = await config.inner.sessionRequest({ batchRequests: batchData, sessionToken });
            if (config.sessionTokenStorage) {
                if (response.newSessionToken === `reset`) {
                    await config.sessionTokenStorage.resetSessionToken();
                }
                else if (response.newSessionToken) {
                    await config.sessionTokenStorage.setSessionToken(response.newSessionToken);
                }
            }
            return response.batchResponses;
        },
    };
    return batchClient;
};

const createJsonRpcSessionWebClient = (config: { inner: JsonRpcWebClient, serverUrl: string }): JsonRpcSessionClient => {
    const sessionClient: JsonRpcSessionClient = {
        sessionRequest: async (sessionData) => {
            const response = await config.inner.webRequest(config.serverUrl, sessionData);
            return response.responseBodyObj;
        },
    };
    return sessionClient;
};

export const createJsonRpcClient = <T>(config: { serverUrl: string, sessionTokenStorage?: JsonRpcSessionStorage, apiMethodNames: JsonRpcApiMethodNames<T> }) => {
    const webClient: JsonRpcWebClient = {
        webRequest: async (serverUrl: string, reqBody: unknown) => {
            const response = await fetchJsonPost<JsonRpcSessionResponseBody>(serverUrl, reqBody);
            return { responseBodyObj: response };
        },
    };
    const sessionClient = createJsonRpcSessionWebClient({ serverUrl: config.serverUrl, inner: webClient });
    const batchClient = createJsonRpcBatchSessionClient({ inner: sessionClient, sessionTokenStorage: config.sessionTokenStorage });
    const coreClient = createJsonRpcCoreBatchClient({ inner: batchClient });
    const apiClient = createJsonRpcApiCoreClient<T>({ inner: coreClient, apiMethodNames: config.apiMethodNames });
    return apiClient;
};
