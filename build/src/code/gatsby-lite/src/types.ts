export type SitePages<T> = {
    pages: SitePageInfo<T>[];
};

export type SitePageInfo<T> = {
    sitePath: string;
    data: T;
}

export type SitePageComponent = {
    Component: () => JSX.Element;
}

export type SiteProvider_Node<T> = {
    loadStaticPageData: () => Promise<SitePages<T>>;
};

export type SiteProvider_Browser<T> = {
    createStaticPage: (sitePath: string, data: T) => SitePageComponent;
};
