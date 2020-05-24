import { CreatePagesArgs } from 'gatsby';
import path from 'path';
import { getSiteProvider } from '../register-site';

const { loadPageData } = getSiteProvider();

// Integrating with custom system
export const createPages = async ({ graphql, actions }: CreatePagesArgs) => {
  const { createPage } = actions;
  const pages = await loadPageData();

  // eslint-disable-next-line no-console
  console.log(`createPages`, { pages });

  // This is relative to project root
  const templatePath = path.resolve(`./gatsby-lite-template.ts`);

  // eslint-disable-next-line no-console
  console.log(`createPages using template at: ${templatePath}`);

  pages.pages.forEach(p => {
    createPage({ path: p.sitePath, component: templatePath, context: p });
  });
};
