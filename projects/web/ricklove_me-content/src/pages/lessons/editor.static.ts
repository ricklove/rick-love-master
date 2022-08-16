import { createPage } from '../../types';
import type { PageProps } from './editor';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    return {
      props: {},
    };
  },
});
