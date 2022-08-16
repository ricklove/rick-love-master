import React, { Fragment, useCallback, useEffect, useState } from 'react';
import type { ArticleItem as ArticleItemRaw, ArticlesContentDocument } from '@ricklove/church-join-the-journey-common';
import { C } from '@ricklove/react-controls';
import { fetchJsonGetRequest } from '@ricklove/utils-fetch';
import { useAsyncWorker } from '@ricklove/utils-react';

type ArticleItem = ArticleItemRaw & { key: string };

export type JoinTheJourneyConfig = {
  articlesIndexUrl: string;
  articlesContentUrl: string;
};
export const JoinTheJourneyArticleList = ({ config }: { config: JoinTheJourneyConfig }) => {
  const [items, setItems] = useState(undefined as undefined | ArticleItem[]);
  const [article, setArticle] = useState(undefined as undefined | ArticleItem);

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

  const openArticle = useCallback((article: ArticleItem) => {
    setArticle(article);
  }, []);
  const closeArticle = useCallback(() => {
    setArticle(undefined);
  }, []);

  return (
    <>
      <C.Loading loading={loading} />
      <C.ErrorBox error={error} />
      {!article && (
        <div className='flex flex-row flex-wrap'>
          {items?.map((x) => (
            <Fragment key={x.key}>
              <ArticleItemView item={x} onOpen={openArticle} />
            </Fragment>
          ))}
        </div>
      )}
      {article && <ArticleDetailView item={article} onClose={closeArticle} />}
    </>
  );
};

const ArticleItemView = ({ item, onOpen }: { item: ArticleItem; onOpen: (item: ArticleItem) => void }) => {
  const { title, author, image, verse, date, url } = item.metadata;

  const open = useCallback(() => onOpen(item), [item.key]);

  return (
    <>
      <div className='flex flex-col' onClick={open}>
        <div>{title}</div>
        <div>{verse}</div>
        <div>{author}</div>
        <div>{date}</div>
        <div>
          <img src={image} />
        </div>
      </div>
    </>
  );
};

const ArticleDetailView = ({ item, onClose }: { item: ArticleItem; onClose: (item: ArticleItem) => void }) => {
  const { title, author, image, verse, date, url } = item.metadata;

  const close = useCallback(() => onClose(item), [item.key]);

  return (
    <>
      <div className='flex flex-col' onClick={close}>
        <div>{title}</div>
        <div>{verse}</div>
        <div>{author}</div>
        <div>{date}</div>
        <div>
          <img src={image} />
        </div>
        {/* TODO: Format Markdown */}
        <div className='whitespace-pre'>{item.markdown}</div>
      </div>
    </>
  );
};
