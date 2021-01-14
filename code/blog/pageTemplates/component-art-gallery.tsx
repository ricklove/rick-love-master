import React, { useEffect } from 'react';
import { useLoadable } from 'utils-react/loadable';
import { Layout } from './layout/layout';
import { SEO } from './layout/seo';

export type ComponentArtGalleryPageData = {
};

export const ComponentArtGalleryPage = (props: { data: ComponentArtGalleryPageData }) => {
    return (
        <Layout>
            <SEO title='Vector Art Gallery - Rick Love' />
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
