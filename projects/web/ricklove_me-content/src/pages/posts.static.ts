import { createPage } from '../types';
import type { PageProps } from './posts';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    return {
      props: {
        value: `Static!!!`,
      },
    };
  },
});
