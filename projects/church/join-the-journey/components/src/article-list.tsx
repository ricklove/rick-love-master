import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { ArticleItem as ArticleItemRaw, ArticlesContentDocument } from '@ricklove/church-join-the-journey-common';
import { C } from '@ricklove/react-controls';
import { fetchJsonGetRequest } from '@ricklove/utils-fetch';
import { useAsyncWorker } from '@ricklove/utils-react';
import { Markdown } from './markdown';

const readStorageAccess = {
  get: () => {
    const v = localStorage.getItem(`read`);
    if (!v) {
      return { read: [] as number[] };
    }
    return JSON.parse(v) as { read: number[] };
  },
  set: (read: number[]) => {
    read = [...new Set(read)].sort((a, b) => a - b);
    localStorage.setItem(`read`, JSON.stringify({ read }));
  },
};

const getReadHash = () => {
  const { read } = readStorageAccess.get();
  const max = Math.max(...read);
  const readSet = new Set(read);

  let t = ``;
  let lastRead = false;
  let iStart = 0;

  for (let i = 0; i <= max; i++) {
    const hasRead = readSet.has(i);
    if (hasRead === lastRead) {
      continue;
    }

    if (hasRead) {
      t += `,${i}`;
      iStart = i;
    } else if (iStart < i - 1) {
      t += `-${i - 1}`;
    }

    lastRead = hasRead;
  }
  return t.substring(1);
};

const getReadFromHash = () => {
  const hash = window.location.hash.replace(/^#/, ``);
  console.log(`getReadFromHash`, { hash });

  const parts = [...`,${hash}`.matchAll(/,(\d+)-?(\d+)?/g)].map((m) => ({
    from: Number(m[1]),
    to: Number(m[2] ?? m[1]),
  }));

  const read = [] as number[];
  for (const p of parts) {
    for (let i = p.from; i <= p.to; i++) {
      read.push(i);
    }
  }

  return read;
};

type ArticleItem = ArticleItemRaw & { key: string; articleNumber: number; isRead: boolean };

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

    const parts = window.location.pathname.split(`/`);
    const date = parts[parts.length - 1];

    const readFromHash = getReadFromHash();
    const { read: readFromState } = readStorageAccess.get();

    const readCombined = [...new Set([...readFromHash, ...readFromState])];
    readStorageAccess.set(readCombined);
    window.history.replaceState(null, ``, `#${getReadHash()}`);

    if (items && article?.metadata.date === date) {
      return;
    }

    doWork(async (stopIfObsolete) => {
      const loadItems = async () => {
        console.log(`JoinTheJourneyArticleList LOADING`, { config });

        const result = await fetchJsonGetRequest<ArticlesContentDocument>(config.articlesContentUrl);
        stopIfObsolete();

        const { read } = readStorageAccess.get();
        console.log(`JoinTheJourneyArticleList LOADED`, { result });
        const items: ArticleItem[] = result.articles.reverse().map((x) => ({
          ...x,
          articleNumber: x.index + 1,
          key: `${x.index + 1}`,
          isRead: read.some((r) => r === x.index + 1),
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
    window.history.pushState(undefined, article.metadata.date, `./${article.metadata.date}#${getReadHash()}`);
    window.scroll({ top: 0, left: 0 });
  }, []);
  const closeArticle = useCallback(() => {
    setArticle(undefined);
    window.history.back();
  }, []);

  const markArticleRead = useCallback((article: ArticleItem) => {
    const { read } = readStorageAccess.get();
    read.push(article.articleNumber);
    readStorageAccess.set(read);

    console.log(`markArticleRead`, { read, article });
    window.history.replaceState(null, ``, `#${getReadHash()}`);

    setItems((s) => s!.map((x) => (x.index === article.index ? { ...x, isRead: true } : x)));
  }, []);

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          minHeight: `100vh`,
        }}
      >
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
        <div
          style={{
            // Hide to prevent reloading images
            display: !article ? `flex` : `none`,
            flexDirection: `row`,
            flexWrap: `wrap`,
            maxWidth: `100vw`,
          }}
        >
          {items?.map((x) => (
            <Fragment key={`${x.key}${x.isRead}`}>
              <ArticleItemView item={x} onOpen={openArticle} />
            </Fragment>
          ))}
        </div>
        {article && <ArticleDetailView item={article} onClose={closeArticle} onRead={markArticleRead} />}
        <div style={{ flex: 1 }} />
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
          position: `relative`,
          margin: 8,
        }}
      >
        {!item.isRead && (
          <div
            style={{
              height: 0,
            }}
          >
            <div
              style={{
                position: `absolute`,
                top: -8,
                right: -8,
                width: 16,
                height: 16,
                borderRadius: 9999,
                border: `1px solid #FFFF00`,
                background: `#0066FF`,
              }}
            />
          </div>
        )}
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            padding: 8,
            boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
            maxWidth: `160px`,
            borderRadius: 4,
            background: item.isRead ? `#EEEEEE` : undefined,
          }}
          onClick={open}
        >
          <ArticleInfo item={item} />
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
      </div>
    </>
  );
};

const ArticleDetailView = ({
  item,
  onClose,
  onRead,
}: {
  item: ArticleItem;
  onClose: (item: ArticleItem) => void;
  onRead: (item: ArticleItem) => void;
}) => {
  const { title, author, image, verse, date, url } = item.metadata;

  const close = useCallback(() => onClose(item), [item.key]);
  const read = useCallback(() => onRead(item), [item.key]);

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
      >
        <ArticleInfo item={item} />
        <div>
          <Markdown markdown={item.markdown} />
        </div>

        <C.LazyComponent onLoad={read}>
          <div />
        </C.LazyComponent>
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
        <div style={{ fontSize: `0.8em` }}>#{item.articleNumber}</div>
      </div>
      {/* <div style={{ fontSize: `0.8em` }}>{date}</div> */}
    </>
  );
};
