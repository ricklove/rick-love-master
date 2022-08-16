import { createPage } from '../../types';
import { copyArtPreviewFilesToPublic } from './_helpers/copyFiles';
import type { PageProps } from './index';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    await copyArtPreviewFilesToPublic();

    return {
      props: {},
    };
  },
});
