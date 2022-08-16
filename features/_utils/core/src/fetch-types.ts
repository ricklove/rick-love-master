export type FetchJsonRequestType = <T, TResponse>(
  url: string,
  json: T,
  options: { method: 'GET' | 'POST' | 'PUT'; timeoutMs?: number },
) => Promise<TResponse>;
