/* eslint-disable react/no-danger */
import './post.css';
import React, { useEffect, useRef } from 'react';
import { Markdown } from '../components/markdown/markdown';
import { SEO } from './layout/seo';
import { Layout } from './layout/layout';
import { getNavigation } from '../site/store';

export type PostPageData = {
    sourceFilePath: string;
    sourceFileContent: string;
    headers: { key: string, value: string }[];

    title: string;
    body: string;
    summary: string;
    excerpt?: string;
    imageUrl?: string;
};

export const PostPage = (props: { data: PostPageData }) => {
    const { body, headers, title } = props.data;
    const Link = getNavigation().StaticPageLinkComponent;

    return (
        <Layout>
            <SEO title={title} description={props.data.excerpt} imageUrl={props.data.imageUrl} />
            <div style={{ display: `block`, minWidth: `100%` }} >
                <div className='post-item'>
                    <p>{title}</p>
                    <p>
                        {headers.map(x => (
                            <span key={x.key} style={{ display: `flex`, flexDirection: `row` }}>
                                <span style={{ minWidth: `100px` }}>{x.key}</span>
                                <span style={{}}>{x.value}</span>
                            </span>
                        ))}
                    </p>
                    <div>
                        <Markdown markdown={body} />
                    </div>
                    <Utterances />
                </div>
            </div>
            <Link to='/'>
                <div>
                    <p>Root</p>
                </div>
            </Link>


        </Layout>
    );
};

const Utterances = () => {

    const divRef = useRef(null as null | HTMLDivElement);
    useEffect(() => {
        if (!divRef.current) { return; }

        const div = divRef.current;
        const s = document.createElement(`script`);
        s.async = true;
        s.src = `https://utteranc.es/client.js`;
        s.setAttribute(`repo`, `ricklove/ricklove-blog-comments`);
        s.setAttribute(`issue-term`, `pathname`);
        s.setAttribute(`label`, `Comment`);
        s.setAttribute(`theme`, `github-dark`);
        s.setAttribute(`crossorigin`, `anonymous`);
        div.append(s);

    }, []);

    return (
        <>
            <div ref={divRef} />
        </>
    );
};
