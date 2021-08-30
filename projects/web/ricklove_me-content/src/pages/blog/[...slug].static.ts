import { createPage } from '../../types';
import { PageProps } from './[...slug]';
import { getPostDataCached, getPostSitePath } from './get-post-data';

export const page = createPage<PageProps>({
  getStaticPaths: async () => {
    const files = await getPostDataCached();

    return {
      fallback: false,
      paths: [...files.map((x) => ({ params: { slug: x.slug } }))],
    };
  },
  getStaticProps: async ({ params }) => {
    const { slug } = params;

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
      },
    };
  },
});
