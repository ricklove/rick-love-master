
export type JsonRpcClientCredentials = unknown & { __type: 'JsonRpcClientCredentials' };

export class JsonRpcError extends Error {
    constructor(public message: string, public data?: unknown, public innerError?: Error) { super(); }
}
