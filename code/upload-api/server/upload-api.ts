import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { UploadApi } from '../client/types';

const s3 = new AWS.S3();

export type Settings = {
    bucket: string;
};

export const createPresignedUploadUrl = async (relPath: string, contentType: string, settings: Settings): Promise<{ uploadUrl: string, readUrl: string }> => {

    // Use Async (because it is more reliable)
    const uploadUrl = await new Promise<string>((resolve, reject) => {
        s3.getSignedUrl(`putObject`, {
            Bucket: settings.bucket,
            // bucket path
            Key: relPath,
            // Expire Upload Url in N secs
            Expires: 100,
            // Don't calculate signature
            // ContentMD5: false,
            // MIME Type:
            ContentType: contentType,
            // Not supported - must be set with header on upload
            // ACL: 'public-read',
        }, (err, url) => {
            if (err) { reject(err); return; }
            resolve(url);
        });
    });

    const readUrl = `https://${settings.bucket}.s3.amazonaws.com/${relPath}`;

    const result = {
        uploadUrl,
        readUrl,
    };

    return result;
};

export const createPresignedUploadUrl_random = (contentType: string, settings: Settings) => {
    const relPath = uuidv4();
    return createPresignedUploadUrl(relPath, contentType, settings);
};

export const createUploadApi = (settings: Settings): UploadApi => {

    const uploadApi: UploadApi = {
        createUploadUrl: (data) => createPresignedUploadUrl_random(data.contentType, settings),
    };

    return uploadApi;
};
