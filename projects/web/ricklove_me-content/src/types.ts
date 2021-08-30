export type GetStaticProps<TProps, TParams = never> = (context: { params: TParams }) => Promise<{
  props: TProps;
}>;
export type GetStaticPaths<TParams = never> = () => Promise<{
  paths: { params: TParams }[];
  fallback: false;
}>;

export type PageExports<TProps, TParams = never> = {
  getStaticPaths?: GetStaticPaths<TParams>;
  getStaticProps: GetStaticProps<TProps, TParams>;
  Page: (props: TProps) => JSX.Element;
};

export const createPage = <TProps, TParams = never>(page: PageExports<TProps, TParams>) => {
  return page;
};
