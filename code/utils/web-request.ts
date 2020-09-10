import { ApiError } from './error';

function fetchWithTimeout(url: string, options: RequestInit, timeout = 10000): Promise<Response> {
    return Promise.race([
        fetch(url, options),
        new Promise((resolve, reject) =>
            setTimeout(() => reject(new ApiError(`Fetch Timeout`)), timeout),
        ) as Promise<Response>,
    ]);
}

export async function webRequest(url: string, data: unknown) {

    const body = JSON.stringify(data);
    const reqData: RequestInit = {
        method: `POST`,
        headers: {
            'Accept': `application/json`,
            'Content-Type': `application/json`,
            'Content-Length': `${body.length}`,
        },
        body,
    };
    const result = await fetchWithTimeout(url, reqData).catch((error) => { throw new ApiError(`Request Failure`, { url, data, error }); });
    if (!result.ok) {
        throw new ApiError(`Api Error`, { data: (await result.json().catch(error => {/* Ignore Parse Error */ })) ?? {}, responseStatus: result.status, request: { url, data } });
    }
    const resultObj = await result.json().catch((error) => { throw new ApiError(`Request Parse Failure`, { url, data, error }); });
    return resultObj;
}
