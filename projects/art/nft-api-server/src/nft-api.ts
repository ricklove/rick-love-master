import { artworkList } from '@ricklove/art-build';
import { ApiError } from '@ricklove/utils-core';

// TODO: Generate and save images as requested
// import AWS from 'aws-sdk';
// const s3 = new AWS.S3({ signatureVersion: `v4` });

export type Settings = {
  // bucket: string;
  // keyBucket: string;
  // tempBucket: string;
};

export const createNftApi = (settings: Settings) => {
  const api = {
    generateNftMetadata: async ({
      path,
      params,
    }: {
      path: string;
      params: {
        type?: 'contract' | 'factory';
        tokenId?: string;
      };
    }): Promise<unknown> => {
      // if (path.includes(`art-121`)) {
      //     return await generateNftMetadata_art121({ params });
      // }

      artworkList.forEach((a) => {
        if (path.includes(a.key)) {
          if (params.type === `contract` || params.type === `factory`) {
            return a.metadata.projectMetadata;
          }
          const tokenId = params.tokenId;
          if (tokenId) {
            return a.metadata.getTokenMetadata(tokenId);
          }

          throw new ApiError(`Unknown Request`, { path, params });
        }
      });

      throw new ApiError(`Unknown Artwork`, { path, params });
    },
  };

  return api;
};
