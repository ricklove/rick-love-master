import { createPage } from '../../types';
import { getLessonsData_cached } from './_helpers/get-lessons-data';
import type { PageProps } from './index';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    const result = await getLessonsData_cached();

    return {
      props: { data: { lessons: result.lessons } },
    };
  },
});
