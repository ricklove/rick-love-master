import { createPage } from '../../types';
import { PageProps, PageProps_Index, PageProps_Page } from './[[...slug]]';
import { getPostDataCached, getPostSitePath } from './get-post-data';

export const page = createPage<PageProps>({
  getStaticPaths: async () => {
    const files = await getPostDataCached();

    return {
      fallback: false,
      paths: [...files.map((x) => ({ params: { slug: x.slug } })), { params: { slug: false } }],
    };
  },
  getStaticProps: async ({ params }) => {
    const { slug } = params;

    if (!slug) {
      const files = await getPostDataCached();

      return {
        props: {
          params: { slug: false },
          posts: files.map((x) => ({
            sitePath: getPostSitePath(x.slug),
            title: x.postPage.title,
            summary: x.postPage.summary,
          })),
        } as PageProps_Index,
      };
    }

    const files = await getPostDataCached();
    const file = files.find((f) => f.slug.join(`/`) === slug.join(`/`));
    if (!file) {
      throw new Error(`Markdown File not found for slug: ${slug.join(`/`)}`);
    }

    return {
      props: {
        params: { slug },
        post: {
          ...file.postPage,
          sitePath: getPostSitePath(file.slug),
        },
      } as PageProps_Page,
    };
  },
});
