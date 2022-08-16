// import fetch from 'isomorphic-unfetch';
// import fetch from 'cross-fetch';
import type { RequestInit, Response } from 'node-fetch';
// import fetch from 'node-fetch';
import { ApiError, AppError, FetchJsonRequestType } from '@ricklove/utils-core';
// export type { RequestInit, Response };

// type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;
// type Response = UnwrapPromise<ReturnType<typeof fetch>>;
// type RequestInit = Parameters<typeof fetch>[1];

type FetchType = (url: string, options?: RequestInit) => Promise<Response>;

export async function fetch(url: string, options?: RequestInit) {
  // console.log(`fetch`, { url, options });

  const fetchActual = (globalThis as { fetch?: FetchType }).fetch;
  if (!fetchActual) {
    throw new AppError(`No fetch available - make sure to import '@ricklove/fetch-node' if using node`);
  }
  const result = await fetchActual(url, options);
  return result;
}

export function fetchWithTimeout(url: string, options?: RequestInit, timeoutMs: number = 10000): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new ApiError(`Fetch Timeout`)), timeoutMs),
    ) as Promise<Response>,
  ]);
}
export const fetchJsonGetRequest = async <TResponse>(url: string) => {
  // console.log(`fetchJsonGetRequest`, { url });

  return await fetchJsonRequest<undefined, TResponse>(url, undefined, { method: `GET` });
};
export const fetchJsonRequest: FetchJsonRequestType = async <TJson, TResponse>(
  url: string,
  data: TJson,
  options: { method: 'GET' | 'POST' | 'PUT'; timeoutMs?: number },
): Promise<TResponse> => {
  // console.log(`fetchJsonGetRequest`, { url });

  const body = data ? JSON.stringify(data) : undefined;
  const reqData: RequestInit = {
    method: options.method,
    headers: {
      Accept: `application/json`,
      'Content-Type': `application/json`,
      ...(!body
        ? {}
        : {
            'Content-Length': `${body?.length}`,
          }),
    },
    body,
  };
  const result = await fetchWithTimeout(url, reqData, options?.timeoutMs).catch((error) => {
    throw new ApiError(`Request Failure`, { url, data, error });
  });
  if (!result.ok) {
    throw new ApiError(`Api Error`, {
      data:
        (await result.json().catch((_error: unknown) => {
          /* Ignore Parse Error */
        })) ?? {},
      responseStatus: result.status,
      request: { url, data },
    });
  }
  const resultObj = await result.json().catch((error: unknown) => {
    throw new ApiError(`Request Parse Failure`, { url, data, error });
  });
  return resultObj as TResponse;
};
