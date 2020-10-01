import React, { useEffect, useState } from 'react';
import { ErrorBox } from 'controls-react/error-box';
import { Loading } from 'controls-react/loading';
import { useAutoLoadingError } from 'utils-react/hooks';
import { HackerNewsItemList } from './hacker-news-item-list';
import { HackerNewsItem } from './hacker-news-types';
import { getTopPosts, HackerNewsPageKind } from './hacker-news-api';


const HackerNewsPage = ({
    page,
}: {
    page: HackerNewsPageKind;
}) => {

    const { loading, error, doWork } = useAutoLoadingError();
    const [posts, setPosts] = useState(null as null | HackerNewsItem[]);

    useEffect(() => {
        doWork(async () => {
            const result = await getTopPosts(page);
            setPosts(result);
        });

    }, [page]);

    return (
        <>
            <Loading loading={loading} />
            <ErrorBox error={error} />
            {posts && (
                <HackerNewsItemList posts={posts} />
            )}
        </>
    );
};

export const HackerNewsPage_TopNews = (props: {}) => (<HackerNewsPage page='top' />);
