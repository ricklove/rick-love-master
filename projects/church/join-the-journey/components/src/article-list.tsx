import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
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
  const pageState = useRef({
    items,
    article,
  });
  pageState.current = {
    items,
    article,
  };

  const { loading, error, doWork } = useAsyncWorker();
  const load = useCallback(() => {
    const { items, article } = pageState.current;

    const parts = window.location.href.split(`/`);
    const date = parts[parts.length - 1];

    if (items && article?.metadata.date === date) {
      return;
    }

    doWork(async (stopIfObsolete) => {
      const loadItems = async () => {
        console.log(`JoinTheJourneyArticleList LOADING`, { config });

        const result = await fetchJsonGetRequest<ArticlesContentDocument>(config.articlesContentUrl);
        stopIfObsolete();

        console.log(`JoinTheJourneyArticleList LOADED`, { result });
        const items = result.articles.reverse().map((x) => ({
          ...x,
          key: `${x.index}`,
        }));
        return items;
      };

      const _items = items ?? (await loadItems());
      const article = _items.find((a) => a.metadata.date === date);
      setItems(_items);
      setArticle(article);
    });
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(`popstate`, load);
    return () => {
      window.removeEventListener(`popstate`, load);
    };
  }, []);

  const openArticle = useCallback((article: ArticleItem) => {
    setArticle(article);
    window.scroll({ left: 0, top: 0 });
    window.history.pushState(null, article.metadata.date, `./${article.metadata.date}`);
  }, []);
  const closeArticle = useCallback(() => {
    setArticle(undefined);
    window.scroll({ left: 0, top: 0 });
    window.history.back();
  }, []);

  return (
    <>
      <div>
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            padding: 8,
            margin: 8,
            boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
          }}
          onClick={closeArticle}
        >
          {article ? `⬅ ` : ``} Join the Journey
        </div>
        <C.Loading loading={loading} />
        <C.ErrorBox error={error} />
        {!article && (
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              flexWrap: `wrap`,
              maxWidth: `100vw`,
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
          padding: 8,
          margin: 8,
          boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
          maxWidth: `160px`,
        }}
        onClick={open}
      >
        <ArticleInfo item={item} />
        <div>
          {/* <img
            src={image}
            alt={author ?? `Author`}
            style={{
              width: 120,
              maxWidth: `100%`,
            }}
          /> */}
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
          padding: 8,
          margin: 8,
          boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
        }}
        onClick={close}
      >
        <ArticleInfo item={item} />
        <div>
          <Markdown markdown={item.markdown} />
        </div>
      </div>
    </>
  );
};

const formatTitleCase = (text: string) => {
  return text.toLocaleLowerCase().replace(/(^|\s)([a-z])/g, (x) => x.toLocaleUpperCase());
};

const ArticleInfo = ({ item }: { item: ArticleItem }) => {
  const { title, author, image, verse, date, url } = item.metadata;

  return (
    <>
      <div style={{ fontWeight: `bold` }}>{formatTitleCase(verse ?? ``)}</div>
      <div style={{}}>{author?.substring(0, 64)}</div>
      <div
        style={{
          display: `flex`,
          flexDirection: `row`,
          justifyContent: `space-between`,
        }}
      >
        <div style={{ fontSize: `0.8em` }}>{title?.replace(/-?\s*Join\s*the\s*Journey\s*-?/, ``)}</div>
        <div style={{ fontSize: `0.8em` }}>#{item.index + 1}</div>
      </div>
      {/* <div style={{ fontSize: `0.8em` }}>{date}</div> */}
    </>
  );
};
