---
title: "Customize Gatsby Blog"
date: "2020-05-12"
path: "/customize-gatsby-blog"
author: "Rick Love"
excerpt: "Remove all the placeholder content and fill your blog with you..."
---

Remove all the placeholder content and fill your blog with you.

## Customize your About Page

- Open `pages/about.md`
- Write a short bio about yourself as a new software developer


### Remove the Placeholder Content

We won't delete this yet, so you can look back on it for a reference.

- Rename `posts/example.md` to `posts/example.md.old`
- Rename `posts/hello.md` to `posts/hello.md.old`
- Rename `pages/showcase.md` to `pages/showcase.md.old`

Later, when you no longer need a reference, you can delete these files.


### Customize the Site Navigation

- Open `gatsby-config.js`
- Customize the `siteMetadata` near the top of the file
    - Change the title, author, etc.
    - Comment out the showcase and example nave sections
    - Example:

```javascript

// ...
  siteMetadata: {
    title: `blog_rick_love`,
    description: `It's about development mostly`,
    copyrights: '2020 Copyright Rick Love',
    author: `Rick Love`,
    logo: {
      src: '',
      alt: '',
    },
    logoText: 'blog_rick_love',
    defaultTheme: 'dark',
    postsPerPage: 5,
    showMenuItems: 2,
    menuMoreText: 'Show more',
    mainMenu: [
      {
        title: 'About',
        path: '/about',
      },
      // {
      //   title: 'Showcase',
      //   path: '/showcase',
      // },
      // {
      //   title: 'Example',
      //   path: '/example',
      // },
    ],
  },
// ...

```

### Bonus: Change the Cursor Color

- Try to figure out how to change the cursor color that is blinking in the top left
- Hint: Its a style
- If you need help, you can always look in the github for my blog and see how I did it.


### Commit and Push to Deploy

- Commit your changes
- Push to Github
- Wait for Netlify to Deploy
- Check Your Site


