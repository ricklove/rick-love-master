import { UploadApiConfig, UploadUrl } from '@ricklove/upload-api-common';
import { delay } from '@ricklove/utils-core';
import { createUploadApiClient } from './upload-client';
import { createUploadUrlAccess, DataOfKind, UploadKind, UploadUrlAccess } from './uploader';

export type VirtualFileSystem = {
  saveTextFile: (relativePath: string, content: string) => Promise<void>;
  loadTextFile: (relativePath: string) => Promise<undefined | string>;
  saveJsonFile: <T extends Record<string, unknown>>(relativePath: string, content: T) => Promise<void>;
  loadJsonFile: <T extends Record<string, unknown>>(relativePath: string) => Promise<undefined | T>;
  saveBinaryFile: (relativePath: string, content: ArrayBuffer, contentType: string) => Promise<void>;
  // loadBinaryFile: (relativePath: string, content: ArrayBuffer, contentType: string) => Promise<void>;
  getFilePublicUrl: (relativePath: string) => Promise<undefined | string>;
};

export const createUploadApiVirtualFileSystem = (
  config: UploadApiConfig & {
    uploadUrlPrefix: string;
    fileSystemIndexUrl: UploadUrl;
  },
): VirtualFileSystem => {
  const uploadApi = createUploadApiClient(config);

  const { uploadUrlPrefix: rootPrefix } = config;

  const normalizeRelativePath = (relativePath: string) => {
    return relativePath.replace(/^\.\//, ``);
  };
  const resolveFileSystemPath = (relativePath: string) => {
    return `${rootPrefix}/${normalizeRelativePath(relativePath)}`;
  };

  type FileIndexDoc = {
    files: { [relativePath: string]: { accessUrl: UploadUrl } };
  };
  const state = {
    fileSystemIndexAccess: createUploadUrlAccess<'json', FileIndexDoc>({
      uploadApiUrl: config.uploadApiUrl,
      uploadUrlPrefix: `./fileSystemIndex.json`,
      currentUploadUrl: config.fileSystemIndexUrl,
      onChangeUploadUrl: async (fileSystemIndexUrl) => {
        // console.log(`fileSystemIndexUrl changed`, { fileSystemIndexUrl });
      },
      kind: `json`,
      contentType: `application/json`,
    }),
    hasLoadedFileSystemIndex: false,
    isLoadingFileSystemIndex: false,
    files: new Map<
      string,
      {
        accessUrl: UploadUrl;
        value?: unknown;
        fileAccess?: UploadUrlAccess;
      }
    >(),
  };
  const saveFileSystemIndex = async () => {
    while (!state.hasLoadedFileSystemIndex) {
      await delay(10);
    }

    const files = Object.fromEntries([...state.files.entries()].map(([k, v]) => [k, { accessUrl: v.accessUrl }]));
    // console.log(`saveFileSystemIndex`, { ...files });

    await state.fileSystemIndexAccess.upload({
      files,
    });
  };
  const loadFileSystemIndex = async () => {
    while (state.isLoadingFileSystemIndex) {
      await delay(10);
    }
    try {
      if (state.hasLoadedFileSystemIndex) {
        return;
      }
      state.isLoadingFileSystemIndex = true;

      const fileSystemIndex = await state.fileSystemIndexAccess.download();
      const files = new Map(Object.entries(fileSystemIndex?.files ?? []));
      if (!state.hasLoadedFileSystemIndex) {
        state.files = files;
      }

      // console.log(`loadFileSystemIndex`, { fileSystemIndex });
    } finally {
      state.hasLoadedFileSystemIndex = true;
      state.isLoadingFileSystemIndex = false;
    }
  };
  const setupFileAccess = async <TKind extends UploadKind, TData extends DataOfKind<TKind>>(
    relativePath: string,
    contentType: string,
    kind: TKind,
  ) => {
    // console.log(`setupFileAccess START`, { relativePath, contentType, kind });

    await loadFileSystemIndex();
    relativePath = normalizeRelativePath(relativePath);

    let f = state.files.get(relativePath);
    if (!f) {
      const { uploadUrl: accessUrl } = await uploadApi.createUploadUrl({
        contentType,
        prefix: resolveFileSystemPath(relativePath),
        shareablePath: false,
      });

      const fItem = {
        accessUrl,
      };
      state.files.set(relativePath, fItem);
      await saveFileSystemIndex();

      f = fItem;
    }

    if (!f.fileAccess) {
      const fileAccess = createUploadUrlAccess<TKind, TData>({
        uploadApiUrl: config.uploadApiUrl,
        uploadUrlPrefix: relativePath,
        currentUploadUrl: f.accessUrl,
        onChangeUploadUrl: async (fileSystemIndexUrl) => {
          // console.log(`fileSystemIndexUrl changed`, { fileSystemIndexUrl });
        },
        kind,
        contentType,
      });

      f.fileAccess = fileAccess as UploadUrlAccess;
    }

    // console.log(`setupFileAccess`, { f });

    return f.fileAccess! as UploadUrlAccess<TKind, TData>;
  };

  const getFilePublicUrl = async (relativePath: string) => {
    await loadFileSystemIndex();
    relativePath = normalizeRelativePath(relativePath);
    return state.files.get(relativePath)?.accessUrl.getUrl;
  };

  return {
    loadTextFile: async (relativePath) => await (await setupFileAccess(relativePath, `text/plain`, `text`)).download(),
    saveTextFile: async (relativePath, content) =>
      await (await setupFileAccess(relativePath, `text/plain`, `text`)).upload(content),
    loadJsonFile: async <T extends Record<string, unknown>>(relativePath: string) =>
      await (await setupFileAccess<'json', T>(relativePath, `application/json`, `json`)).download(),
    saveJsonFile: async <T extends Record<string, unknown>>(relativePath: string, content: T) => {
      await (await setupFileAccess<'json', T>(relativePath, `application/json`, `json`)).upload(content);
    },
    saveBinaryFile: async (relativePath: string, content: ArrayBuffer, contentType: string) => {
      await (await setupFileAccess(relativePath, contentType, `binary`)).upload(content);
    },
    getFilePublicUrl,
  };
};
