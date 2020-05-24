export type SitePages<T> = {
    includePagesFolder: boolean;
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
    loadPageData: () => Promise<SitePages<T>>;
};

export type SiteProvider_Browser<T> = {
    createPage: (sitePath: string, data: T) => SitePageComponent;
};
