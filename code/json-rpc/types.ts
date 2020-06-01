import { JsonTyped } from 'utils/json';

export type JsonRpcRequestBody = {
    jsonrpc: `2.0`;
    id: string;
    method: string;
    params: unknown;
};

export type JsonRpcResponseBody = {
    jsonrpc: `2.0`;
    id: string;
    result?: unknown;
    error?: unknown;
};

export class JsonRpcError extends Error {
    constructor(public message: string, public data?: unknown, public innerError?: Error) { super(); }
}


// Api Endpoints (used in app)
export type JsonRpcApiEndpointNames<T> = { [K in keyof T]: T[K] extends (...args: infer PARAMS) => Promise<infer R> ? K : never };
export type JsonRpcApiEndpoints<T> = { [K in keyof T]: T[K] extends (...args: infer PARAMS) => Promise<infer R> ? (...args: PARAMS) => Promise<R> : never };
export type JsonRpcApiClientFactory<T> = (endpointNames: JsonRpcApiEndpointNames<T>) => JsonRpcApiEndpoints<T>;

// JsonRpc 2.0 Spec
export type JsonRpcCoreClient = {
    request: (data: JsonRpcRequestBody) => Promise<JsonRpcResponseBody>;
};

// JsonRpc 2.0 Batching
export type JsonRpcBatchClient = {
    batchRequest: (batchData: JsonRpcRequestBody[]) => Promise<JsonRpcResponseBody[]>;
};

// With Session (Credentials)
export type JsonRpcSessionClient = {
    sessionRequest: (sessionData: JsonRpcSessionRequestBody) => Promise<JsonRpcSessionResponseBody>;
}

export type JsonRpcSessionToken = unknown & { __type: 'JsonRpcSessionToken' };
export type JsonRpcSessionToken_New = undefined | null | JsonRpcSessionToken | 'reset';

export type JsonRpcSessionRequestBody = {
    batchRequests: JsonRpcRequestBody[];
    sessionToken?: JsonRpcSessionToken;
};

export type JsonRpcSessionResponseBody = {
    batchResponses: JsonRpcResponseBody[];
    newSessionToken?: JsonRpcSessionToken_New;
};

// Web: Client => Server
export type JsonRpcWebClient = {
    webRequest: (serverUrl: string, bodyObj: JsonRpcSessionRequestBody)
        => Promise<{ responseBodyObj: JsonRpcSessionResponseBody }>;
}

// The cookies are an alternative storage for the sessionToken (HttpOnly, Secure)
export type JsonRpcWebJsonServer = {
    respond: (requestBodyJson: JsonTyped<JsonRpcSessionRequestBody>, requestCookieJson?: JsonTyped<JsonRpcSessionToken>)
        => Promise<{ responseBodyJson: JsonTyped<JsonRpcSessionResponseBody>, responseCookieJson?: JsonTyped<JsonRpcSessionToken>, responseCookieReset?: boolean }>;
}

export type JsonRpcWebServer = {
    respond: (requestBodyObj: JsonRpcSessionRequestBody, requestCookieObj?: JsonRpcSessionToken)
        => Promise<{ responseBodyObj: JsonRpcSessionResponseBody, responseCookieObj?: JsonRpcSessionToken_New }>;
}

export type JsonRpcSessionServer = {
    respond: (sessionData: JsonRpcSessionRequestBody)
        => Promise<JsonRpcSessionResponseBody>;
}

export type JsonRpcBatchServer<TContext> = {
    respond: (batchData: JsonRpcRequestBody[], context: TContext)
        => Promise<{ responses: JsonRpcResponseBody[], newSessionToken?: JsonRpcSessionToken_New }>;
}

export type JsonRpcCoreServer<TContext> = {
    respond: (data: JsonRpcRequestBody, context: TContext)
        => Promise<{ response: JsonRpcResponseBody, newSessionToken?: JsonRpcSessionToken_New }>;
}

export type JsonRpcApiServer<TContext> = {
    respond: (method: string, params: unknown, context: TContext)
        => Promise<{ responseData: unknown, newSessionToken?: JsonRpcSessionToken_New }>;
}
