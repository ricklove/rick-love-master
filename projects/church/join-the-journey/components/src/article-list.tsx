import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import type { ArticleItem as ArticleItemRaw, ArticlesContentDocument } from '@ricklove/church-join-the-journey-common';
import { C } from '@ricklove/react-controls';
import { fetchJsonGetRequest } from '@ricklove/utils-fetch';
import { useAsyncWorker } from '@ricklove/utils-react';
import { Markdown } from './markdown';
import { createUserProgressService, UserProgressConfig, UserProgressService } from './user-data';

const readStorageAccess = {
  get: () => {
    const v = localStorage.getItem(`joinTheJourneyReadArticles`);
    if (!v) {
      return { read: [] as number[] };
    }
    return JSON.parse(v) as { read: number[] };
  },
  set: (read: number[]) => {
    read = [...new Set(read)].sort((a, b) => a - b);
    localStorage.setItem(`joinTheJourneyReadArticles`, JSON.stringify({ read }));
  },
};

const getReadHash = ({ read }: { read: number[] }) => {
  const max = Math.max(...read);
  const readSet = new Set(read);

  let t = ``;
  let lastRead = false;
  let iStart = 0;

  for (let i = 0; i <= max + 1; i++) {
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

const getReadFromHash = (hashValue: string) => {
  console.log(`getReadFromHash`, { hashValue });

  const parts = [...`,${hashValue}`.matchAll(/,(\d+)-?(\d+)?/g)].map((m) => ({
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
} & UserProgressConfig;
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

    const urlProgressCode = window.location.search.match(/p=([\w]+)/)?.[1];

    if (items && article?.metadata.date === date) {
      return;
    }

    doWork(async (stopIfObsolete) => {
      const loadItems = async () => {
        // Load Articles
        const result = await fetchJsonGetRequest<ArticlesContentDocument>(config.articlesContentUrl);
        stopIfObsolete();

        // Load url progress code
        if (urlProgressCode) {
          await userProgressService.current.loadShareCode({ shareCode: urlProgressCode });
          window.history.replaceState(undefined, ``, `./`);
        }

        // Load user progress
        await userProgressService.current.loadUserProgress();
        stopIfObsolete();

        const { read } = readStorageAccess.get();
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
    setReadHash(getReadHash(readStorageAccess.get()));
    load();
    window.addEventListener(`popstate`, load);
    return () => {
      window.removeEventListener(`popstate`, load);
    };
  }, []);

  const [readHash, setReadHash] = useState(getReadHash(readStorageAccess.get()));

  const openArticle = useCallback((article: ArticleItem) => {
    setArticle(article);
    window.history.pushState(undefined, article.metadata.date, `./${article.metadata.date}`);
    window.scroll({ top: 0, left: 0 });
  }, []);
  const closeArticle = useCallback(() => {
    setArticle(undefined);
    window.history.back();
    changeReadState(getReadHash(readStorageAccess.get()));
  }, []);

  const markArticleRead = useCallback((article: ArticleItem) => {
    const { read } = readStorageAccess.get();
    read.push(article.articleNumber);
    saveRead(read);

    console.log(`markArticleRead`, { read, article });
    // Don't trigger a state change until close
    // setItems((s) => s!.map((x) => (x.index === article.index ? { ...x, isRead: true } : x)));
  }, []);

  const toggleArticleRead = useCallback((article: ArticleItem) => {
    let { read } = readStorageAccess.get();
    if (!read.includes(article.articleNumber)) {
      read.push(article.articleNumber);
    } else {
      read = read.filter((x) => x !== article.articleNumber);
    }
    saveRead(read);

    console.log(`toggleArticleRead`, { read, article });
    changeReadState(getReadHash(readStorageAccess.get()));
  }, []);

  const changeReadState = (hashValue: string) => {
    const read = getReadFromHash(hashValue);
    saveRead(read);

    setReadHash(hashValue);
    setItems((s) =>
      s?.map((x) => ({
        ...x,
        isRead: read.some((r) => r === x.index + 1),
      })),
    );
  };

  const userProgressService = useRef(createUserProgressService(config));
  const saveRead = (read: number[]) => {
    (async () => {
      readStorageAccess.set(read);
      await userProgressService.current.saveUserProgress();
    })();
  };

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          alignItems: `stretch`,
          width: `100%`,
          height: `100%`,
        }}
      >
        <div
          style={{
            display: `flex`,
            flexDirection: `row`,
            flexWrap: `wrap`,
            alignItems: `center`,
            padding: 8,
            margin: 8,
            boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
          }}
        >
          <div style={{ flex: 1 }} onClick={article ? closeArticle : undefined}>
            {article ? `⬅ ` : ``} Join the Journey
          </div>
          <UserSettings value={readHash} onChange={changeReadState} userProgressServiceRef={userProgressService} />
        </div>
        <C.Loading loading={loading} />
        <C.ErrorBox error={error} />
        <div
          style={{
            // Hide to prevent reloading images
            display: !article ? `grid` : `none`,
            gridTemplateColumns: `repeat(auto-fill, minmax(80px, 200px))`,
            gap: 32,
            padding: 16,
            maxWidth: `calc(100% - 64px)`,
          }}
        >
          {items?.map((x) => (
            <Fragment key={`${x.key}${x.isRead}`}>
              <ArticleItemView item={x} onOpen={openArticle} onToggleRead={toggleArticleRead} />
            </Fragment>
          ))}
        </div>
        {article && <ArticleDetailView item={article} onClose={closeArticle} onRead={markArticleRead} />}
        <div style={{ flex: 1 }} />
        <Footer />
      </div>
    </>
  );
};

const UserSettings = ({
  value,
  onChange,
  userProgressServiceRef,
}: {
  value: string;
  onChange: (value: string) => void;
  userProgressServiceRef: { current: UserProgressService };
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded((s) => !s), []);

  const [hashValue, setHashValue] = useState(value);
  useEffect(() => {
    setHashValue(value);
  }, [value]);

  const changeHashValue = useCallback(({ target: { value } }: { target: { value: string } }) => {
    setHashValue(value);
  }, []);

  const saveHashValue = useCallback(() => {
    onChange(hashValue);
  }, [hashValue]);

  const { loading, error, doWork } = useAsyncWorker();
  const [progressCode, setProgressCode] = useState(``);
  useEffect(() => {
    doWork(async (stopIfObsolete) => {
      const result = await userProgressServiceRef.current.createShareCode();
      stopIfObsolete();
      setProgressCode(result.shareCode);
    });
  }, []);

  const changeProgressCode = useCallback(({ target: { value } }: { target: { value: string } }) => {
    setProgressCode(value);
  }, []);
  const saveProgressCode = useCallback(() => {
    doWork(async (stopIfObsolete) => {
      await userProgressServiceRef.current.loadShareCode({ shareCode: progressCode });
      stopIfObsolete();
      // Storage was directly modified after loading share code
      const hashValue = getReadHash(readStorageAccess.get());
      setHashValue(hashValue);
      onChange(hashValue);
    });
  }, [progressCode]);

  return (
    <>
      <button style={{ padding: 4, fontSize: 16, background: `unset` }} onClick={toggleExpanded}>{`⚙`}</button>
      {expanded && (
        <div style={{ width: `100%` }}>
          <div>Edit Progress:</div>
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              alignItems: `center`,
            }}
          >
            <label>Read</label>
            <input
              style={{ marginLeft: 4, padding: 4, fontSize: 16 }}
              type='text'
              value={hashValue}
              onChange={changeHashValue}
            />
            <button style={{ marginLeft: 4, padding: 4, alignSelf: `stretch` }} onClick={saveHashValue}>
              Save
            </button>
          </div>
          <div
            style={{
              display: `flex`,
              flexDirection: `row`,
              alignItems: `center`,
            }}
          >
            <label>Progress Sync Code</label>
            <input
              style={{ marginLeft: 4, padding: 4, fontSize: 16 }}
              type='text'
              value={progressCode}
              onChange={changeProgressCode}
            />
            <button style={{ marginLeft: 4, padding: 4, alignSelf: `stretch` }} onClick={saveProgressCode}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = () => {
  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          alignItems: `center`,
          maxWidth: `100%`,
          padding: 8,
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <Markdown
            markdown={`
### Love the Journey?

Then we want you! We need you to sign-up to lead just one day's devotional. 
Would you allow yourself to be stretched beyond your comfort level to the encouragement 
and betterment of the family of believers? Pray about it. And then [check out this link to sign up.](https://www.jointhejourneycollegeside.org/lead.html)
      `}
          />
        </div>
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
            alignItems: `center`,
          }}
        >
          <img
            style={{ width: 160, maxWidth: `100%` }}
            src='https://rick-love-blog-user-data.s3.us-east-1.amazonaws.com/join-the-journey/Collegeside.png'
            alt='Collegeside'
          />
          <p>Copyright © 2022 Collegeside Church of Christ, All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

const ArticleItemView = ({
  item,
  onOpen,
  onToggleRead,
}: {
  item: ArticleItem;
  onOpen: (item: ArticleItem) => void;
  onToggleRead: (item: ArticleItem) => void;
}) => {
  const { title, author, image, verse, date, url } = item.metadata;

  const open = useCallback(() => onOpen(item), [item.key]);
  const toggleRead = useCallback(() => onToggleRead(item), [item.key]);

  return (
    <>
      <div
        // Block Safari Reader Mode
        className='comment'
        style={{
          position: `relative`,
          width: `100%`,
          height: `100%`,
          padding: 8,
          boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
          borderRadius: 4,
          opacity: item.isRead ? 0.8 : undefined,
        }}
      >
        <div
          style={{
            height: 0,
          }}
          onClick={toggleRead}
        >
          <div
            style={{
              position: `absolute`,
              top: -8,
              right: -8,
              width: 16,
              height: 16,
              borderRadius: 9999,
              border: `1px solid #FFFFFF`,
              background: item.isRead ? `#CCCCCC` : `#0066FF`,
            }}
          />
        </div>
        <div
          style={{
            display: `flex`,
            flexDirection: `column`,
          }}
          onClick={open}
        >
          <ArticleInfo item={item} />
          <div
            style={{
              display: `flex`,
              flexDirection: `column`,
              alignItems: `center`,
            }}
          >
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

  const markdownCleaned = item.markdown.replace(/!\[\]\([^)]*5981052803000701[^)]*\)/g, ``);

  return (
    <>
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          alignSelf: `center`,
          maxWidth: `100%`,
          width: 600,
          margin: 8,
          boxShadow: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
        }}
      >
        <div
          style={{
            padding: 4,
          }}
        >
          <ArticleInfo item={item} />
        </div>
        <div
          style={{
            padding: 4,
          }}
        >
          <Markdown markdown={markdownCleaned} />
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
