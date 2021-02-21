import { createNftApi } from './nft-api';

const settings = {
    // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // bucket: process.env.BUCKET!,
    // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // keyBucket: process.env.KEYBUCKET!,
    // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // tempBucket: process.env.TEMPBUCKET!,
};

export const handleNftApiWebRequest = async (requestData: { path: string, params: { [name: string]: string } }) => {
    const { path, params } = requestData;

    const nftApi = createNftApi(settings);
    const result = await nftApi.generateNftMetadata({ path, params });

    return result;
};
