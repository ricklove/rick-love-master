export type UploadApi = {
    createUploadUrl: (data: { contentType: string }) => Promise<{ uploadUrl: string, readUrl: string }>;
};

export type UploadApiEndpointName = keyof UploadApi;
export type UploadApiEndpointRequestData<K extends UploadApiEndpointName> = Parameters<UploadApi[K]>[0];

export type UploadApiRequestData = {
    endpoint: UploadApiEndpointName;
    data: unknown;
};
