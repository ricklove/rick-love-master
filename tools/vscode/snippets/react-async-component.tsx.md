```ts
import React, { Fragment, useEffect, useState } from 'react';
import type { ArticleItem, ArticlesContentDocument } from '@ricklove/church-join-the-journey-common';
import { fetchJsonGetRequest } from '@ricklove/utils-fetch';
import { useAsyncWorker } from '@ricklove/utils-react';

export type JoinTheJourneyConfig = {
  articlesIndexUrl: string;
  articlesContentUrl: string;
};
export const JoinTheJourneyArticleList = ({ config }: { config: JoinTheJourneyConfig }) => {
  const [items, setItems] = useState(undefined as undefined | (ArticleItem & { key: string })[]);

  const { loading, error, doWork } = useAsyncWorker();
  useEffect(() => {
    doWork(async (stopIfObsolete) => {
      const result = await fetchJsonGetRequest<ArticlesContentDocument>(config.articlesContentUrl);
      stopIfObsolete();

      setItems(
        result.articles.map((x) => ({
          ...x,
          key: `${x.index}`,
        })),
      );
    });
  }, []);

  return (
    <>
      <div className='flex flex-row'>
        {items?.map((x) => (
          <Fragment key={x.key} />
        ))}
      </div>
    </>
  );
};
```
