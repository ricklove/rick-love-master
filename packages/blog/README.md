# Blog for Rick Love

## Deployment

- Uses a sister package for development and build, but scripts are also setup here for convenience
    - `yarn develop`
    - `yarn build` (to build results)
    - `yarn serve` (to preview build result)

### Netlify Settings:

Netlify settings can just use normal gatsby settings pointing at the `blog-gatsby-site`

- Repository
    [this]
- Base directory
    packages/blog-gatsby-site
- Build command
    gatsby build
- Publish directory
    packages/blog-gatsby-site/public/