import { createPage } from '../../types';
import { getLessonsData_cached } from './_helpers/get-lessons-data';
import { PageProps } from './[name]';

export const page = createPage<PageProps>({
  getStaticPaths: async () => {
    const result = await getLessonsData_cached();

    return {
      fallback: false,
      paths: [...result.lessons.map((x) => ({ params: { name: x.key } }))],
    };
  },
  getStaticProps: async ({ params }) => {
    const { name } = params;
    const result = await getLessonsData_cached();

    return {
      props: {
        params: { name },
        pageData: {
          lesson: result.lessons.find((x) => x.key === params.name)!,
        },
      },
    };
  },
});
