import { createPage } from '../types';
import type { PageProps } from './404';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    return {
      props: {},
    };
  },
});
