export type GetStaticProps<TProps = Record<string, never>, TParams = never> = (context: {
  params: TParams;
}) => Promise<{
  props: TProps;
}>;
export type GetStaticPaths<TParams = never> = () => Promise<{
  paths: { params: TParams };
  fallback: false;
}>;

export type PageExports<TProps = Record<string, never>, TParams = never> = {
  getStaticPaths?: GetStaticPaths<TParams>;
  getStaticProps: GetStaticProps<TProps, TParams>;
  Page: (props: TProps) => JSX.Element;
};

export const createPage = <TProps = Record<string, never>, TParams = never>(page: PageExports<TProps, TParams>) => {
  return page;
};
