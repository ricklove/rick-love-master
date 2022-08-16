import React, { Fragment, useCallback, useEffect, useState } from 'react';
import type { ArticleItem as ArticleItemRaw, ArticlesContentDocument } from '@ricklove/church-join-the-journey-common';
import { C } from '@ricklove/react-controls';
import { fetchJsonGetRequest } from '@ricklove/utils-fetch';
import { useAsyncWorker } from '@ricklove/utils-react';
import { Markdown } from './markdown';

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
      console.log(`JoinTheJourneyArticleList LOADING`, { config });

      const result = await fetchJsonGetRequest<ArticlesContentDocument>(config.articlesContentUrl);
      stopIfObsolete();

      console.log(`JoinTheJourneyArticleList LOADED`, { result });

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
      <div>
        <C.Loading loading={loading} />
        <C.ErrorBox error={error} />
        {!article && (
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              flexWrap: `wrap`,
            }}
          >
            {items?.map((x) => (
              <Fragment key={x.key}>
                <ArticleItemView item={x} onOpen={openArticle} />
              </Fragment>
            ))}
          </div>
        )}
        {article && <ArticleDetailView item={article} onClose={closeArticle} />}
      </div>
    </>
  );
};

const ArticleItemView = ({ item, onOpen }: { item: ArticleItem; onOpen: (item: ArticleItem) => void }) => {
  const { title, author, image, verse, date, url } = item.metadata;

  const open = useCallback(() => onOpen(item), [item.key]);

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          flexWrap: `wrap`,
          padding: 8,
          margin: 8,
          boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
        }}
        onClick={open}
      >
        <div>{title}</div>
        <div>{verse}</div>
        <div>{author}</div>
        <div>{date}</div>
        <div>
          <C.SmartImage
            src={image}
            alt={author ?? `Author`}
            style={{
              width: 120,
              maxWidth: `100%`,
            }}
          />
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
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
        }}
        onClick={close}
      >
        <div>{title}</div>
        <div>{verse}</div>
        <div>{author}</div>
        <div>{date}</div>
        {/* <div>
          <C.SmartImage
            src={image}
            alt={author ?? `Author`}
            style={{
              width: 300,
              maxWidth: `100%`,
            }}
          />
        </div> */}
        <div>
          <Markdown markdown={item.markdown} />
        </div>
      </div>
    </>
  );
};
