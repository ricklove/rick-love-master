import React from 'react';
import { Helmet } from 'react-helmet';
import * as Store from '../../site/store';

// Fav Icons
import favicon16 from '../../assets/favicon16.png';
import favicon32 from '../../assets/favicon32.png';
import favicon64 from '../../assets/favicon64.png';

export const SEO = ({ title, description = ``, lang = `en`, imageUrl, meta = [] }: {
  title: string;
  description?: string;
  lang?: string;
  imageUrl?: string;
  meta?: { name: string, content: string }[];
}) => {

  // Well that was easy
  const { site } = Store;
  const metaDescription = description || site.siteMetadata.description;

  const imageMeta = imageUrl ? [
    { property: `og:image`, content: site.siteMetadata.siteRoot + imageUrl },
    { property: `twitter:card`, content: `summary_large_image` },
    { property: `twitter:image`, content: site.siteMetadata.siteRoot + imageUrl },
  ] : [];

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ].concat(imageMeta).concat(meta)}
      link={[
        { rel: `icon`, type: `image/png`, sizes: `16x16`, href: `${favicon16}` },
        { rel: `icon`, type: `image/png`, sizes: `32x32`, href: `${favicon32}` },
        { rel: `shortcut icon`, type: `image/png`, href: `${favicon64}` },
      ]}
    />
  );
};
