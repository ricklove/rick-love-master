import { createPage } from '../../types';
import type { PageProps } from './index';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    return {
      props: {},
    };
  },
});
