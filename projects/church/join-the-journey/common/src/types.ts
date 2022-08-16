export type ArticlesIndexDocument = {
  articles: Omit<ArticleItem, 'markdown'>[];
};
export type ArticlesContentDocument = {
  articles: ArticleItem[];
};
export type ArticleItem = {
  index: number;
  isCloned?: boolean;
  metadata: {
    title: string | undefined;
    author: string | undefined;
    image: string;
    verse: string | undefined;
    date: string;
    url: string;
  };
  markdown: string;
};
