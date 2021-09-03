import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { UploadApi, UploadUrl } from '@ricklove/upload-api-common';
import { ApiError } from '@ricklove/utils-core';
import { SecureToken, secureToken } from '@ricklove/utils-node';

const s3 = new AWS.S3({ signatureVersion: `v4` });

export type Settings = {
  bucket: string;
  keyBucket: string;
  tempBucket: string;
};

export const createPresignedUploadUrl = async (
  relativePath: string,
  contentType: string,
  settings: Settings,
  options?: { existingSecretKey?: SecureToken; useTempBucket?: boolean },
): Promise<{ uploadUrl: UploadUrl }> => {
  const bucket = options?.useTempBucket ? settings.tempBucket : settings.bucket;

  console.log(`createPresignedUploadUrl - create putUrl`);
  const putUrl = await s3.getSignedUrlPromise(`putObject`, {
    Bucket: bucket,
    // bucket path
    Key: relativePath,
    // Expire Upload Url in N secs
    // Max Time is 7 days
    Expires: 7 * 24 * 60 * 60,
    // Don't calculate signature
    // ContentMD5: false,
    // MIME Type:
    ContentType: contentType,
    // Not supported - must be set with header on upload
    // ACL: 'public-read',
  });

  const getUrl = `https://${bucket}.s3.amazonaws.com/${relativePath}`;

  // Save a secretKey
  console.log(`createPresignedUploadUrl - save secretKey in keyBucket`);

  const secretKey = options?.existingSecretKey ?? (await secureToken.generateSecureToken());
  await new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: settings.keyBucket,
        Key: `${relativePath}-key`,
        Body: secretKey,
      },
      {},
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      },
    );
  });

  const result: UploadUrl = {
    putUrl,
    getUrl,
    relativePath,
    expirationTimestamp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    contentType,
    secretKey,
    isTemporaryObject: options?.useTempBucket ?? false,
  };

  return { uploadUrl: result };
};

export const createPresignedUploadUrl_random = async (
  contentType: string,
  settings: Settings,
  options?: { prefix?: string; shareablePath?: boolean },
) => {
  const relPath = `${options?.prefix ? `${options.prefix}/` : ``}${
    options?.shareablePath ? await secureToken.generateHumanReadableRandomCode() : uuidv4()
  }`;
  return await createPresignedUploadUrl(relPath, contentType, settings, { useTempBucket: options?.shareablePath });
};

export const createUploadApi = (settings: Settings): UploadApi => {
  const uploadApi: UploadApi = {
    createUploadUrl: (data) =>
      createPresignedUploadUrl_random(data.contentType ?? `application/json`, settings, {
        prefix: data.prefix,
        shareablePath: data.shareablePath ?? false,
      }),
    renewUploadUrl: async (data) => {
      // Verify Key
      console.log(`renewUploadUrl - verify secretKey`);
      // data.uploadUrl.secretKey;
      const secretKeyResult = await new Promise<string>((resolve, reject) => {
        s3.getObject(
          {
            Bucket: settings.keyBucket,
            Key: `${data.uploadUrl.relativePath}-key`,
          },
          (err, result) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(`${result.Body}`);
          },
        );
      });
      if (secretKeyResult !== data.uploadUrl.secretKey) {
        throw new ApiError(`Invalid Secret Key`);
      }

      console.log(`renewUploadUrl - create new url`);
      return await createPresignedUploadUrl(data.uploadUrl.relativePath, data.uploadUrl.contentType, settings, {
        existingSecretKey: data.uploadUrl.secretKey,
      });
    },
  };

  return uploadApi;
};
