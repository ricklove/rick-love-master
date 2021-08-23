import { ApiError } from 'utils/error';
import { HackerNewsItem, HackerNewsItemId } from './hacker-news-types';

export type HackerNewsPageKind = 'top' | 'new';
export type TopPostData = HackerNewsItemId[];

const pageTopPostUrl: { [page in HackerNewsPageKind]: string } = {
    top: `https://hacker-news.firebaseio.com/v0/topstories.json`,
    new: `https://hacker-news.firebaseio.com/v0/newstories.json`,
};

const getItemUrl = (itemId: HackerNewsItemId) => {
    return `https://hacker-news.firebaseio.com/v0/item/${itemId}.json`;
};

const fetchJson = async <T>(url: string): Promise<T> => {
    const response = await fetch(url, { mode: `cors` });
    if (!response.ok) {
        console.log(`Failed to get data`, { url, status: response.status, statusText: response.statusText, response });
        throw new ApiError(`Failed to get data`, { url, status: response.status, statusText: response.statusText });
    }
    return await response.json() as T;
};

export const getTopPosts = async (page: HackerNewsPageKind): Promise<HackerNewsItem[]> => {
    const pageUrl = pageTopPostUrl[page];
    const itemIds = await fetchJson<HackerNewsItemId[]>(pageUrl);
    const itemIds_top = itemIds.slice(0, 30);
    const items = await Promise.all(itemIds_top.map(async x => await fetchJson<HackerNewsItem>(getItemUrl(x))));
    return items;
};
