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

export type JsonRpcSessionRequestBody = {
    batchRequests: JsonRpcRequestBody[];
    sessionToken?: JsonRpcSessionToken;
};

export type JsonRpcSessionResponseBody = {
    batchResponses: JsonRpcResponseBody[];
    newSessionToken?: JsonRpcSessionToken;
    resetSessionToken?: boolean;
};

// Web: Client => Server
export type JsonRpcWebClient = {
    webRequest: <T>(serverUrl: string, bodyObj: unknown) => Promise<{ responseBodyObj: T }>;
}

// The cookies are an alternative storage for the sessionToken
export type JsonRpcWebServer_Handler = {
    webHandler: (body: string, cookie?: JsonRpcSessionToken) => Promise<{ responseBody: string, responseCookie?: JsonRpcSessionToken, resetResponseCookie?: boolean }>;
}

export type JsonRpcSessionHandler = {
    sessionHandler: (sessionData: JsonRpcSessionRequestBody) => Promise<JsonRpcSessionResponseBody>;
}
