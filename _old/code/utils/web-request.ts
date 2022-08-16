import { ApiError } from './error';

export function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<Response> {
    return Promise.race([
        fetch(url, options),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new ApiError(`Fetch Timeout`)), timeoutMs),
        ) as Promise<Response>,
    ]);
}

export async function webRequest(url: string, data: unknown, options?: { method?: 'POST' | 'PUT', timeoutMs?: number }) {

    const body = JSON.stringify(data);
    const reqData: RequestInit = {
        method: options?.method ?? `POST`,
        headers: {
            'Accept': `application/json`,
            'Content-Type': `application/json`,
            'Content-Length': `${body.length}`,
        },
        body,
    };
    const result = await fetchWithTimeout(url, reqData, options?.timeoutMs).catch((error) => { throw new ApiError(`Request Failure`, { url, data, error }); });
    if (!result.ok) {
        throw new ApiError(`Api Error`, { data: (await result.json().catch(error => {/* Ignore Parse Error */ })) ?? {}, responseStatus: result.status, request: { url, data } });
    }
    const resultObj = await result.json().catch((error) => { throw new ApiError(`Request Parse Failure`, { url, data, error }); });
    return resultObj;
}
