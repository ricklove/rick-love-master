/* eslint-disable unused-imports/no-unused-imports */
import fetch, {
  Blob,
  blobFrom,
  blobFromSync,
  File,
  fileFrom,
  fileFromSync,
  FormData,
  Headers,
  Request,
  Response,
} from 'node-fetch';

const g = globalThis as Record<string, unknown>;

if (!g.fetch) {
  g.fetch = fetch;
  g.Headers = Headers;
  g.Request = Request;
  g.Response = Response;
}
