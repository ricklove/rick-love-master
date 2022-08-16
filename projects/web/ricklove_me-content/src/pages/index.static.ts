import { createPage } from '../types';
import { getPostDataCached, getPostSitePath } from './blog/_helpers/get-post-data';
import type { PageProps } from './index';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    const files = await getPostDataCached();

    return {
      props: {
        params: { slug: false },
        posts: files.map((x) => ({
          sitePath: getPostSitePath(x.slug),
          title: x.postPage.title,
          summary: x.postPage.summary,
        })),
      },
    };
  },
});
