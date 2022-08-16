import { jsonParse, jsonStringify } from 'utils/json';
import { JsonRpcWebServer, JsonRpcSessionServer, JsonRpcBatchServer, JsonRpcSessionToken, JsonRpcSessionResponseBody, JsonRpcCoreServer, JsonRpcApiServer, JsonRpcSessionToken_New, JsonRpcWebJsonServer, JsonRpcSessionRequestBody } from './types';
import { encodeJsonRpcResponseData, encodeJsonRpcResponseData_error } from './json-body';

type ApiAccess<TContext> = { execute: (method: string, params: unknown, context: TContext) => Promise<{ result: unknown, newSessionToken?: JsonRpcSessionToken_New }> };
const createJsonRpcApiServer = <TContext>(config: { apiAccess: ApiAccess<TContext> }): JsonRpcApiServer<TContext> => {
    const server: JsonRpcApiServer<TContext> = {
        respond: async (method, params, context) => {
            const result = await config.apiAccess.execute(method, params, context);
            console.log(`createJsonRpcApiServer.server.respond`, { result });
            return {
                responseData: result.result,
                newSessionToken: result.newSessionToken,
            };
        },
    };
    return server;
};

const createJsonRpcCoreServer = <TContext>(config: { upper: JsonRpcApiServer<TContext> }): JsonRpcCoreServer<TContext> => {
    const server: JsonRpcCoreServer<TContext> = {
        respond: async (data, context) => {

            try {
                const { responseData, newSessionToken } = await config.upper.respond(data.method, data.params, context);
                const encoded = encodeJsonRpcResponseData(data.id, responseData);
                return {
                    response: encoded,
                    newSessionToken,
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

const createJsonRpcBatchServer = <TContext>(config: { upper: JsonRpcCoreServer<TContext> }): JsonRpcBatchServer<TContext> => {
    const server: JsonRpcBatchServer<TContext> = {
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

type ContextProvider<TContext> = {
    getContext: (sessionToken?: JsonRpcSessionToken) => Promise<{ context: TContext, newSessionToken?: JsonRpcSessionToken_New } | { error: unknown & {}, newSessionToken?: JsonRpcSessionToken_New }>;
};
const createJsonRpcSessionServer = <TContext>(config: { upper: JsonRpcBatchServer<TContext>, contextProvider: ContextProvider<TContext> }): JsonRpcSessionServer => {
    const server: JsonRpcSessionServer = {
        respond: async (sessionData) => {
            const contextResult = await config.contextProvider.getContext(sessionData.sessionToken);
            if (`error` in contextResult) {
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

            console.log(`createJsonRpcSessionServer.server.respond`, { response });

            return response;
        },
    };
    return server;
};

const createJsonRpcWebServer = (config: { upper: JsonRpcSessionServer, useCookieOnlySessionToken?: boolean }): JsonRpcWebServer => {
    const server: JsonRpcWebServer = {
        respond: async (requestBodyObj, requestCookieObj) => {
            const reqData = requestBodyObj;
            if (config.useCookieOnlySessionToken) {
                reqData.sessionToken = undefined;
            }
            if (requestCookieObj) {
                reqData.sessionToken = requestCookieObj;
            }
            const response = await config.upper.respond(reqData);
            const responseBodyObj = { ...response };
            const responseCookieObj = response.newSessionToken;
            if (config.useCookieOnlySessionToken) {
                delete responseBodyObj.newSessionToken;
            }
            return {
                responseBodyObj,
                responseCookieObj,
            };
        },
    };
    return server;
};

const createJsonRpcWebJsonServer = (config: { upper: JsonRpcWebServer }): JsonRpcWebJsonServer => {
    const server: JsonRpcWebJsonServer = {
        respond: async (requestBodyJson, requestCookieJson) => {
            const reqData = jsonParse(requestBodyJson);
            const cookieData = requestCookieJson ? jsonParse(requestCookieJson) : undefined;
            const response = await config.upper.respond(reqData, cookieData);
            const responseBodyJson = jsonStringify(response.responseBodyObj);
            const responseCookieJson = response.responseCookieObj !== `reset` && response.responseCookieObj
                ? jsonStringify<JsonRpcSessionToken>(response.responseCookieObj)
                : undefined;
            const responseCookieReset = response.responseCookieObj === `reset`;
            return {
                responseBodyJson,
                responseCookieJson,
                responseCookieReset,
            };
        },
    };
    return server;
};

export const createJsonRpcServer_stacks = <TContext>(config: { contextProvider: ContextProvider<TContext>, apiAccess: ApiAccess<TContext>, useCookieOnlySessionToken?: boolean }) => {
    const apiServer = createJsonRpcApiServer<TContext>({ apiAccess: config.apiAccess });
    const coreServer = createJsonRpcCoreServer<TContext>({ upper: apiServer });
    const batchServer = createJsonRpcBatchServer<TContext>({ upper: coreServer });
    const sessionServer = createJsonRpcSessionServer<TContext>({ upper: batchServer, contextProvider: config.contextProvider });
    const webServer = createJsonRpcWebServer({ upper: sessionServer, useCookieOnlySessionToken: config.useCookieOnlySessionToken });
    const webJsonServer = createJsonRpcWebJsonServer({ upper: webServer });
    return {
        apiServer,
        coreServer,
        batchServer,
        sessionServer,
        webServer,
        webJsonServer,
    };
};
export const createJsonRpcServer = <TContext>(config: { contextProvider: ContextProvider<TContext>, apiAccess: ApiAccess<TContext>, useCookieOnlySessionToken?: boolean }): JsonRpcWebJsonServer => {
    const stacks = createJsonRpcServer_stacks(config);
    return stacks.webJsonServer;
};
