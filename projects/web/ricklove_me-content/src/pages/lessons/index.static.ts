import { getLessonsData_cached } from '../../components/lessons/get-lessons-data';
import { createPage } from '../../types';
import type { PageProps } from './index';

export const page = createPage<PageProps>({
  getStaticProps: async () => {
    const result = await getLessonsData_cached();

    return {
      props: { data: { lessons: result.lessons } },
    };
  },
});
