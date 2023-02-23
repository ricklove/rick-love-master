import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { siteMetadata } from '../site';

export const SEO = ({
  title,
  description = ``,
  lang = `en`,
  imageUrl,
  meta = [],
}: {
  title: string;
  description?: string;
  lang?: string;
  imageUrl?: string;
  meta?: { name: string; content: string }[];
}) => {
  // Well that was easy
  const metaDescription = description || siteMetadata.description;

  const imageMeta = imageUrl
    ? [
        { property: `og:image`, content: siteMetadata.siteRoot + imageUrl },
        { property: `twitter:card`, content: `summary_large_image` },
        { property: `twitter:image`, content: siteMetadata.siteRoot + imageUrl },
      ]
    : [];

  return (
    <HelmetProvider>
      <Helmet
        htmlAttributes={{
          lang,
        }}
        title={title}
        titleTemplate={`%s | ${siteMetadata.title}`}
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
            content: siteMetadata.author,
          },
          {
            name: `twitter:title`,
            content: title,
          },
          {
            name: `twitter:description`,
            content: metaDescription,
          },
        ]
          .concat(imageMeta)
          .concat(meta)}
        link={[
          { rel: `icon`, type: `image/png`, sizes: `16x16`, href: `/_media/favicon16.png` },
          { rel: `icon`, type: `image/png`, sizes: `32x32`, href: `/_media/favicon32.png` },
          { rel: `shortcut icon`, type: `image/png`, href: `/_media/favicon64.png` },
        ]}
      />
    </HelmetProvider>
  );
};
