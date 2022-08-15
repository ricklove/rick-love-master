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
