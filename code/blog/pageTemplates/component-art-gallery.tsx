import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';

export type ComponentArtGalleryPageData = {
    artKey?: string;
    artTitle?: string;
    artImageUrl?: string;
};

export const ComponentArtGalleryPage = (props: { data: ComponentArtGalleryPageData }) => {

    const {
        artKey,
        artTitle,
        artImageUrl,
    } = props.data;
    // console.log(`ComponentArtGalleryPage`, { artKey, artTitle, artImageUrl });

    return (
        <Layout zoom={false}>
            <SEO
                title={`${artTitle ? `${artTitle} - ` : ``}NFT Art - Rick Love`}
                imageUrl={artImageUrl ? `/content/art${artImageUrl.replace(/^\./, ``)}` : undefined}
            />
            <ComponentAuto data={props.data} />
        </Layout>
    );
};


const ComponentAuto = (props: { data: ComponentArtGalleryPageData }) => {

    const { LoadedComponent, load } = useLoadable(async () => (await import(`art/art-gallery`)).ArtGallery);
    useEffect(() => { (async () => await load())(); }, [load]);
    return (
        <div>
            {LoadedComponent && <LoadedComponent />}
        </div>
    );
};
