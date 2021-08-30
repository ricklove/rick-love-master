/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page_posts } from '@ricklove/ricklove_me-content';
export default Page_posts;

import { page_posts } from '@ricklove/ricklove_me-content/lib/index-static';

export const getStaticProps = async (context: any) => {
    return await page_posts.getStaticProps(context);
};

