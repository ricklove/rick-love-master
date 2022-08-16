import { UploadUrl } from '@ricklove/upload-api-common';
import { AppError } from '@ricklove/utils-core';
import { fetchWithTimeout } from '@ricklove/utils-fetch';
import { createUploadApiClient } from './upload-client';

export const downloadData = async (getUrl: string) => {
  const result = await fetchWithTimeout(getUrl, {
    method: `GET`,
    headers: {
      Accept: `application/json`,
    },
  });
  const json = (await result.json()) as { data: unknown };
  return json.data;
};

export const createUploader = (uploadUrl: UploadUrl) => {
  return {
    uploadData: async (data: unknown) => {
      const body = JSON.stringify({ data });
      const result = await fetchWithTimeout(uploadUrl.putUrl, {
        method: `PUT`,
        headers: {
          Accept: `application/json`,
          'Content-Type': `application/json`,
          'Content-Length': `${body.length}`,
        },
        body,
      });

      if (!result.ok) {
        throw new AppError(`Upload Failed`);
      }
    },
    downloadData: async (): Promise<unknown> => {
      return await downloadData(uploadUrl.getUrl);
    },
  };
};

export const createSmartUploader = <T extends {}>(args: {
  getUploadUrl: () => Promise<null | UploadUrl>;
  setUploadUrl: (uploadUrl: UploadUrl) => Promise<void>;
  uploadUrlPrefix: string;
  uploadApiUrl: string;
}) => {
  const uploadApiWebClient = createUploadApiClient(args);

  let _uploadUrl = null as null | UploadUrl;

  const setupUploadUrl = async () => {
    if (_uploadUrl) {
      return _uploadUrl;
    }

    // eslint-disable-next-line require-atomic-updates
    _uploadUrl = await args.getUploadUrl();
    if (_uploadUrl) {
      return _uploadUrl;
    }

    // eslint-disable-next-line require-atomic-updates
    _uploadUrl = (await uploadApiWebClient.createUploadUrl({ prefix: args.uploadUrlPrefix })).uploadUrl;
    await args.setUploadUrl(_uploadUrl);
    return _uploadUrl;
  };

  return {
    load: async (): Promise<null | T> => {
      const uploadUrl = await setupUploadUrl();

      try {
        const data = await downloadData(uploadUrl.getUrl);
        return data as T;
      } catch {
        return null;
      }
    },
    save: async (data: T) => {
      let uploadUrl = await setupUploadUrl();

      try {
        const uploader = createUploader(uploadUrl);
        await uploader.uploadData(data);
      } catch {
        // Try again after renew upload token
        uploadUrl = (await uploadApiWebClient.renewUploadUrl({ uploadUrl })).uploadUrl;
        await args.setUploadUrl(uploadUrl);
        _uploadUrl = uploadUrl;

        const uploader = createUploader(uploadUrl);
        await uploader.uploadData(data);
      }

      // Upload backup (temp)
      const backupUrl = (await uploadApiWebClient.createUploadUrl({ prefix: `backup/${uploadUrl.relativePath}` }))
        .uploadUrl;
      const backupUploader = createUploader(backupUrl);
      await backupUploader.uploadData(data);
    },
  };
};

export const uploadWithAutoRenew = async (args: {
  uploadApiUrl: string;
  uploadUrlPrefix: string;
  currentUploadUrl: undefined | UploadUrl;
  onChangeUploadUrl: (uploadUrl: UploadUrl) => Promise<void>;
  upload: (uploadUrl: UploadUrl) => Promise<void>;
}) => {
  const uploadApiWebClient = createUploadApiClient({
    uploadApiUrl: args.uploadApiUrl,
  });
  let _uploadUrl = args.currentUploadUrl;

  if (!_uploadUrl) {
    _uploadUrl = (await uploadApiWebClient.createUploadUrl({ prefix: args.uploadUrlPrefix })).uploadUrl;
    await args.onChangeUploadUrl(_uploadUrl);
  }

  try {
    await args.upload(_uploadUrl);
  } catch {
    // Try again after renew upload token
    _uploadUrl = (await uploadApiWebClient.renewUploadUrl({ uploadUrl: _uploadUrl })).uploadUrl;
    await args.onChangeUploadUrl(_uploadUrl);
    await args.upload(_uploadUrl);
  }
};

export type BinaryData = ArrayBuffer;
export type UploadKind = 'text' | 'json' | 'binary';
export type DataOfKind<T extends UploadKind> = T extends 'text'
  ? string
  : T extends 'json'
  ? Record<string, unknown>
  : BinaryData;

export type UploadUrlAccess<
  TKind extends UploadKind = UploadKind,
  TData extends DataOfKind<TKind> = DataOfKind<TKind>,
> = {
  upload: (body: TData) => Promise<void>;
  download: () => Promise<undefined | TData>;
};

export const createUploadUrlAccess = <TKind extends UploadKind, TData extends DataOfKind<TKind>>(args: {
  uploadApiUrl: string;
  uploadUrlPrefix: string;
  currentUploadUrl: undefined | UploadUrl;
  onChangeUploadUrl: (uploadUrl: UploadUrl) => Promise<void>;
  kind: TKind;
  contentType: string;
}): UploadUrlAccess<TKind, TData> => {
  let currentUploadUrl = args.currentUploadUrl;

  return {
    upload: async (body: TData) => {
      await uploadWithAutoRenew({
        ...args,
        onChangeUploadUrl: async (uploadUrl) => {
          currentUploadUrl = uploadUrl;
          await args.onChangeUploadUrl(uploadUrl);
        },
        upload: async (uploadUrl) => {
          const bodyToUpload = args.kind === `json` ? JSON.stringify(body) : (body as string | BinaryData);

          const result = await fetchWithTimeout(uploadUrl.putUrl, {
            method: `PUT`,
            headers: {
              Accept: `application/json`,
              'Content-Type': args.contentType,
            },
            body: bodyToUpload,
          });

          if (!result.ok) {
            throw new AppError(`Upload Failed`);
          }

          // console.warn(`upload DONE`, { getUrl: uploadUrl.getUrl });
        },
      });
    },
    download: async (): Promise<undefined | TData> => {
      if (!currentUploadUrl) {
        console.warn(`currentUploadUrl is not set`, { currentUploadUrl });
        return undefined;
      }

      const result = await fetchWithTimeout(currentUploadUrl.getUrl, {
        method: `GET`,
        headers: {
          Accept: `application/json`,
        },
      });

      if (!result.ok) {
        // console.warn(`Download failed`, { result });
        return undefined;
      }

      if (args.kind === `text`) {
        const text = await result.text();
        return text as TData;
      }

      if (args.kind === `json`) {
        const json = await result.json();
        return json as TData;
      }

      return (await result.arrayBuffer()) as TData;
    },
  };
};
