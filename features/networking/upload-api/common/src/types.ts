import { SecureToken } from '@ricklove/utils-core';

export type UploadUrl = {
    getUrl: string;
    putUrl: string;
    relativePath: string;
    contentType: string;
    expirationTimestamp: number;
    secretKey: SecureToken;
    isTemporaryObject: boolean;
};

export type UploadApi = {
    createUploadUrl: (data: { contentType?: string; prefix?: string; shareablePath?: boolean }) => Promise<{ uploadUrl: UploadUrl }>;
    renewUploadUrl: (data: { uploadUrl: UploadUrl }) => Promise<{ uploadUrl: UploadUrl }>;
};

export type UploadApiEndpointName = keyof UploadApi;
export type UploadApiEndpointRequestData<TName extends UploadApiEndpointName> = Parameters<UploadApi[TName]>[0];

export type UploadApiRequestData = {
    endpoint: UploadApiEndpointName;
    data: unknown;
};
