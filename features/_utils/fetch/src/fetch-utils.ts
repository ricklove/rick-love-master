import fetch from 'isomorphic-unfetch';
import { ApiError, FetchJsonRequestType } from '@ricklove/utils-core';

export function fetchWithTimeout(
  url: string,
  options: fetch.IsomorphicRequestInit,
  timeoutMs: number = 10000,
): Promise<fetch.IsomorphicResponse> {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new ApiError(`Fetch Timeout`)), timeoutMs),
    ) as Promise<fetch.IsomorphicResponse>,
  ]);
}

export const fetchJsonRequest: FetchJsonRequestType = async <TJson, TResponse>(
  url: string,
  data: TJson,
  options: { method: 'GET' | 'POST' | 'PUT'; timeoutMs?: number },
): Promise<TResponse> => {
  const body = JSON.stringify(data);
  const reqData: fetch.IsomorphicRequestInit = {
    method: options.method,
    headers: {
      Accept: `application/json`,
      'Content-Type': `application/json`,
      'Content-Length': `${body.length}`,
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
  return resultObj;
};
