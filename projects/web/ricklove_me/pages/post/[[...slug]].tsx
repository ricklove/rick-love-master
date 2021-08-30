/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page_post______slug__ } from '@ricklove/ricklove_me-content';
export default Page_post______slug__;

import { page_post______slug__ } from '@ricklove/ricklove_me-content/lib/index-static';

export const getStaticProps = async (context: any) => {
    return await page_post______slug__.getStaticProps(context);
};

export const getStaticPaths = async () => {
    return await page_post______slug__.getStaticPaths();
};

