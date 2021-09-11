import { createPage } from '../../types';
import { getPostDataCached, getPostSitePath } from './_helpers/get-post-data';
import { PageProps } from './[...slug]';

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
