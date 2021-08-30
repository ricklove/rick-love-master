type PageParams<T> = T extends { params: infer UParams } ? UParams : never;

export type GetStaticProps<TProps> = (context: { params: PageParams<TProps> }) => Promise<{
  props: TProps;
}>;
export type GetStaticPaths<TProps> = () => Promise<{
  paths: { params: PageParams<TProps> }[];
  fallback: false;
}>;

export type PageExports<TProps> = {
  getStaticPaths?: GetStaticPaths<TProps>;
  getStaticProps: GetStaticProps<TProps>;
};

export const createPage = <TProps>(page: PageExports<TProps>) => {
  return page;
};
