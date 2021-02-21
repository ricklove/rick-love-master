import AWS from 'aws-sdk';
import { ApiError } from 'utils/error';
import { generateNftMetadata_art121 } from '../art-121/server/generate-nft-metadata';

const s3 = new AWS.S3({ signatureVersion: `v4` });

export type Settings = {
    // bucket: string;
    // keyBucket: string;
    // tempBucket: string;
};

export const createNftApi = (settings: Settings) => {

    const api = {
        generateNftMetadata: async ({ path, params }: { path: string, params: { [name: string]: string } }) => {
            if (path.includes(`art-121`)) {
                return await generateNftMetadata_art121({ params });
            }

            throw new ApiError(`Unknown Artwork`, { path, params });
        },
    };

    return api;
};
