import { SecureToken } from 'utils/secure-token';

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
    createUploadUrl: (data: { contentType: string, shareablePath?: boolean }) => Promise<{ uploadUrl: UploadUrl }>;
    renewUploadUrl: (data: { uploadUrl: UploadUrl }) => Promise<{ uploadUrl: UploadUrl }>;
};

export type UploadApiEndpointName = keyof UploadApi;
export type UploadApiEndpointRequestData<K extends UploadApiEndpointName> = Parameters<UploadApi[K]>[0];

export type UploadApiRequestData = {
    endpoint: UploadApiEndpointName;
    data: unknown;
};
