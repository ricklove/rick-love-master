import { createPage } from '../../types';
import { artworkList } from './_helpers/art';
import { copyArtPreviewFilesToPublic } from './_helpers/copyFiles';
import { PageProps } from './[name]';

export const page = createPage<PageProps>({
  getStaticPaths: async () => {
    await copyArtPreviewFilesToPublic();

    const artworks = artworkList;

    return {
      fallback: false,
      paths: [...artworks.map((x) => ({ params: { name: x.key } }))],
    };
  },
  getStaticProps: async ({ params }) => {
    const { name } = params;

    return {
      props: {
        params: { name },
        pageData: {
          key: name,
          title: artworkList.find((x) => x.key === name)?.title ?? ``,
        },
      },
    };
  },
});
