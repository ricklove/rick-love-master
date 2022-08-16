import { JoinTheJourneyArticleList } from '@ricklove/church-join-the-journey-components';

export const App = () => {
  return (
    <div>
      <JoinTheJourneyArticleList
        config={{
          articlesContentUrl:
            'https://rick-love-blog-user-data.s3.us-east-1.amazonaws.com/join-the-journey/articles-content.json/80b45812-dce3-49b5-aabc-ff394bca14ab',
          articlesIndexUrl:
            'https://rick-love-blog-user-data.s3.us-east-1.amazonaws.com/join-the-journey/articles-index.json/06400796-a6cb-4fe9-b16d-00af368c083f',
        }}
      />
    </div>
  );
};
