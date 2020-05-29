export class WebRequestError extends Error {
    constructor(public message: string, public data?: unknown, public innerError?: Error) { super(); }
}

const fetchWithTimeout = (url: string, options: RequestInit, timeout = 15000): Promise<Response> => {
    let timeoutId = 0 as unknown as ReturnType<typeof setTimeout>;

    const pTimeout: Promise<Response> = new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
            const errorInfo = { isTimeout: true, message: `Web Api Timeout`, error: new WebRequestError(`Web Api Timeout`), details: { url, options } };
            reject(errorInfo);
        }, timeout);
    });

    const pMain = (async () => {
        const result = await fetch(url, options)
            .catch(error => {
                throw new WebRequestError(`Fetch Error`, { url }, error);
            });

        clearTimeout(timeoutId);
        return result;
    })();

    return Promise.race([pTimeout, pMain]);
};

export const webRequest_jsonPost = async <TResponse extends {}>(url: string, data: unknown): Promise<TResponse> => {

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

    const result = await fetchWithTimeout(url, reqData)
        .catch((error) => {
            throw new WebRequestError(`Request Failure`, { url, data }, error);
        });

    if (!result.ok) {
        throw new WebRequestError(`Api Error`, {
            data: (await result.json().catch((error) => {/* Ignore */ })) ?? {},
            responseStatus: result.status,
            request: { url, data },
        });
    }
    const resultObj = await result.json()
        .catch((error) => {
            throw new WebRequestError(`Request Parse Failure`, { url, data }, error);
        });

    return resultObj as TResponse;
};
