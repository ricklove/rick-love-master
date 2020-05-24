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


export type SiteProvider<T> = {
    loadPageData: () => Promise<SitePages<T>>;
    createPage: (sitePath: string, data: T) => SitePageComponent;
};
