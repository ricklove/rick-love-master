import { CreatePagesArgs, CreateWebpackConfigArgs } from 'gatsby';
import path from 'path';
import LoadablePlugin from '@loadable/webpack-plugin';
import { getSiteProvider_Node } from './register-site-provider-node';


// Integrating with custom system
export const createPages = async ({ graphql, actions }: CreatePagesArgs) => {
    const { createPage } = actions;

    const { loadStaticPageData: loadPageData } = getSiteProvider_Node();
    const pageData = await loadPageData();

    // eslint-disable-next-line no-console
    console.log(`createPages`, { pages: pageData.pages.map(x => x.sitePath) });

    // This is relative to project root
    const templatePath = path.resolve(`./gatsby-lite-template.ts`);

    // eslint-disable-next-line no-console
    console.log(`createPages using template at: ${templatePath}`);

    pageData.pages.forEach(p => {
        createPage({ path: p.sitePath, component: templatePath, context: p });
    });

    // TODO: Handle custom watch - like blog content
    // pageData.subscribePageChange?.((pages)=>{
    // });
};

export const onCreateWebpackConfig = ({ actions }: CreateWebpackConfigArgs) => {
    actions.setWebpackConfig({
        plugins: [new LoadablePlugin()],
    });
};
