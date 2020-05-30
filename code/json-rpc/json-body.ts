let _nextId = 1000;

export type JsonRpcClientCredentials = unknown & { __type: 'JsonRpcClientCredentials' };

export const encodeJsonRpcRequestBody = (method: string, params: unknown, credentials?: null | JsonRpcClientCredentials) => {
    const id = _nextId++;
    const data = {
        jsonrpc: `2.0.sec`,
        method,
        params,
        id,
        credentials,
    };
    return data;
};

export const decodeJsonRpcRequestBody = <T>(body: {} & unknown) => {
    const data = body as {
        jsonrpc: `2.0.sec`;
        method: string;
        params: T;
        id: string;
        credentials: null | JsonRpcClientCredentials;
    };
    return data;
};

export const encodeJsonRpcResponseData = (id: string, result: unknown, newCredentials: null | JsonRpcClientCredentials) => {
    return {
        jsonrpc: `2.0.sec`,
        id,
        newCredentials,
        result: result ?? {},
    };
};

export const encodeJsonRpcResponseData_error = (id: string, error: unknown) => {
    return {
        jsonrpc: `2.0.sec`,
        id,
        newCredentials: null,
        error: error ?? {},
    };
};

export const decodeJsonRpcResponseBody = <T>(body: {} & unknown) => {
    const data = body as {
        jsonrpc: `2.0.sec`;
        id: string;
        newCredentials: null | JsonRpcClientCredentials;
        result?: T;
        error?: unknown;
    };
    return data;
};
