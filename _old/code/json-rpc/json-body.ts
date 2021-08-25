import { JsonRpcRequestBody, JsonRpcResponseBody } from './types';

let _nextId = 1000;

export const encodeJsonRpcRequestBody = (method: string, params: unknown): JsonRpcRequestBody => {
    const id = `${_nextId++}`;
    const data = {
        jsonrpc: `2.0`,
        method,
        params,
        id,
    } as const;
    return data;
};

export const decodeJsonRpcRequestBody = <T>(body: {} & unknown): JsonRpcRequestBody => {
    const data = body as {
        jsonrpc: `2.0`;
        method: string;
        params: T;
        id: string;
    };
    return data;
};

export const encodeJsonRpcResponseData = (id: string, result: unknown): JsonRpcResponseBody => {
    return {
        jsonrpc: `2.0`,
        id,
        result: result ?? {},
    };
};

export const encodeJsonRpcResponseData_error = (id: string, error: unknown): JsonRpcResponseBody => {
    return {
        jsonrpc: `2.0`,
        id,
        error: error ?? {},
    };
};

export const decodeJsonRpcResponseBody = <T>(body: {} & unknown): JsonRpcResponseBody => {
    const data = body as {
        jsonrpc: `2.0`;
        id: string;
        result?: T;
        error?: unknown;
    };
    return data;
};
