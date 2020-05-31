import { JsonRpcWebServer, JsonRpcSessionServer, JsonRpcBatchServer, JsonRpcSessionToken, JsonRpcSessionResponseBody, JsonRpcCoreServer, JsonRpcApiServer, JsonRpcSessionToken_New } from './types';
import { encodeJsonRpcResponseData, encodeJsonRpcResponseData_error } from './json-body';

type ApiAccess<T> = { execute: (method: string, params: unknown, context: T) => Promise<{ result: unknown, newSessionToken?: JsonRpcSessionToken_New }> };
const createJsonRpcApiServer = <T>(config: { apiAccess: ApiAccess<T> }): JsonRpcApiServer<T> => {
    const server: JsonRpcApiServer<T> = {
        respond: async (method, params, context) => {
            const result = await config.apiAccess.execute(method, params, context);
            return {
                responseData: result.result,
                newSessionToken: result.newSessionToken,
            };
        },
    };
    return server;
};

const createJsonRpcCoreServer = <T>(config: { upper: JsonRpcApiServer<T> }): JsonRpcCoreServer<T> => {
    const server: JsonRpcCoreServer<T> = {
        respond: async (data, context) => {

            try {
                const result = await config.upper.respond(data.method, data.params, context);
                const encoded = encodeJsonRpcResponseData(data.id, result);
                return {
                    response: encoded,
                    newSessionToken: result.newSessionToken,
                };
            } catch (error) {
                const encoded = encodeJsonRpcResponseData_error(data.id, error);
                return {
                    response: encoded,
                };
            }
        },
    };
    return server;
};

const createJsonRpcBatchServer = <T>(config: { upper: JsonRpcCoreServer<T> }): JsonRpcBatchServer<T> => {
    const server: JsonRpcBatchServer<T> = {
        respond: async (batchData, context) => {

            const results = await Promise.all(batchData.map(async (x) => {
                const result = await config.upper.respond(x, context);
                return result;
            }));

            return {
                responses: results.map(x => x.response),
                newSessionToken: results.map(x => x.newSessionToken).filter(x => x)[0],
            };
        },
    };
    return server;
};

type ContextProvider<T> = {
    getContext: (sessionToken?: JsonRpcSessionToken) => Promise<{ context: T, error?: unknown, newSessionToken?: JsonRpcSessionToken_New }>;
};
const createJsonRpcSessionServer = <T>(config: { upper: JsonRpcBatchServer<T>, contextProvider: ContextProvider<T> }): JsonRpcSessionServer => {
    const server: JsonRpcSessionServer = {
        respond: async (sessionData) => {
            const contextResult = await config.contextProvider.getContext(sessionData.sessionToken);
            if (contextResult.error) {
                return {
                    batchResponses: sessionData.batchRequests.map(x => encodeJsonRpcResponseData_error(x.id, contextResult.error)),
                    newSessionToken: contextResult.newSessionToken,
                };
            }

            const result = await config.upper.respond(sessionData.batchRequests, contextResult.context);
            const response: JsonRpcSessionResponseBody = {
                batchResponses: result.responses,
                newSessionToken: result.newSessionToken ?? contextResult.newSessionToken,
            };
            return response;
        },
    };
    return server;
};

const createJsonRpcWebServer = (config: { upper: JsonRpcSessionServer }): JsonRpcWebServer => {
    const server: JsonRpcWebServer = {
        respond: async (requestBodyObj, cookieObj) => {
            const reqData = requestBodyObj;
            if (cookieObj) {
                reqData.sessionToken = cookieObj;
            }
            const response = await config.upper.respond(reqData);
            const responseBodyObj = response;
            const responseCookieObj = response.newSessionToken;
            return {
                responseBodyObj,
                responseCookieObj,
            };
        },
    };
    return server;
};

export const createJsonRpcServer = <T>(config: { contextProvider: ContextProvider<T>, apiAccess: ApiAccess<T> }): JsonRpcWebServer => {
    const apiServer = createJsonRpcApiServer<T>({ apiAccess: config.apiAccess });
    const coreServer = createJsonRpcCoreServer<T>({ upper: apiServer });
    const batchServer = createJsonRpcBatchServer<T>({ upper: coreServer });
    const sessionServer = createJsonRpcSessionServer<T>({ upper: batchServer, contextProvider: config.contextProvider });
    const webServer = createJsonRpcWebServer({ upper: sessionServer });
    return webServer;
};
