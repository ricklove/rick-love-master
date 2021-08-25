export class FetchError extends Error {
    constructor(public message: string, public data?: unknown, public innerError?: Error) { super(); }
}

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 15000): Promise<Response> => {
    let timeoutId = 0 as unknown as ReturnType<typeof setTimeout>;

    const pTimeout: Promise<Response> = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            const errorInfo = { isTimeout: true, message: `Web Api Timeout`, error: new FetchError(`Web Api Timeout`), details: { url, options } };
            reject(errorInfo);
        }, timeout);
    });

    const pMain = (async () => {
        const result = await fetch(url, options)
            .catch(error => {
                throw new FetchError(`Fetch Error`, { url }, error);
            });

        clearTimeout(timeoutId);
        return result;
    })();

    return Promise.race([pTimeout, pMain]);
};

export const fetchJsonPost = async <TResponse extends {}>(url: string, data: unknown): Promise<TResponse> => {

    const body = JSON.stringify(data);
    const reqData: RequestInit = {
        method: `POST`,
        headers: {
            'Accept': `application/json`,
            'Content-Type': `application/json`,
            'Content-Length': `${body.length}`,
        },
        body,
        // Include Cookies
        credentials: `include`,
        // POST is always no-cache
        cache: `no-cache`,
    };

    const result = await fetchWithTimeout(url, reqData)
        .catch((error) => {
            throw new FetchError(`Request Failure`, { url, data }, error);
        });

    if (!result.ok) {
        throw new FetchError(`Api Error`, {
            data: (await result.json().catch((error) => {/* Ignore */ })) ?? {},
            responseStatus: result.status,
            request: { url, data },
        });
    }
    const resultObj = await result.json()
        .catch((error) => {
            throw new FetchError(`Request Parse Failure`, { url, data }, error);
        });

    return resultObj as TResponse;
};
