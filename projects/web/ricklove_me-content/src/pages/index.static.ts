import { createPage } from '../types';
import type { PageProps } from './index';
import { getPostDataCached, getPostSitePath } from './post/get-post-data';

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
