import { gamesListData } from '../../components/games/games';
import { createPage } from '../../types';
import { PageProps } from './[name]';

export const page = createPage<PageProps>({
  getStaticPaths: async () => {
    const games = gamesListData;

    return {
      fallback: false,
      paths: [...games.map((x) => ({ params: { name: x.name } }))],
    };
  },
  getStaticProps: async ({ params }) => {
    const { name } = params;

    return {
      props: {
        params: { name },
        pageData: {
          gameName: name,
        },
      },
    };
  },
});
