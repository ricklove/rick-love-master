---
title: "Build Gatsby Blog"
date: "2020-05-11"
path: "/build-gatsby-blog"
author: "Rick Love"
excerpt: "Build your own React based Blog with Gatsby"
---

Gatsby is a static site generator based on React.

What this practically means is that you can create a great website that is super fast, but still allows you to code in the best UI Framework (React) to customize and create powerful components.

It has a great ecosystem and is very popular. In fact, the React team uses Gatsby for their docs pages.

### Preview the Target

- Visit: https://www.gatsbyjs.org/starters/panr/gatsby-starter-hello-friend/
- Open the Demo Site
- Explore

### Create a Netlify Account

- Visit: https://www.netlify.com/
- Create an Account
- Download the netlify cli tools

### Create a New Netlify Site with Gatsby

- Visit: https://www.gatsbyjs.org/starters/panr/gatsby-starter-hello-friend/
- Click the Netlify button (On the Right next to `Try the starter`)
- Connect to github
- Name your repo: `YOUR-NAME-blog`
    - i.e. `rick-love-blog`
- Hit 'Save & Deploy`
- Wait for it to Build (Takes about 1 Minute)
- Open the site (it will have a random url)

### Clone the Gatsby repo locally

- Open the Github link for your blog (from the last step, or go to github and find your blog repo)
- Get the clone url (on the right)
- Git Clone your repo
    - Copy the clone link
    - Open Terminal 
    - Navigate to your `Projects/Sites` directory
        - `cd /Projects/Sites`
    - Run the git clone command:
        - i.e. `git clone https://github.com/ricklove/rick-love-blog.git`

### Open the site in Visual Studio Code

- Open vscode
- Open Folder: `Projects/Sites/YOUR-NAME-blog`
- View the contents
    - `src/pages/`
        - This contains the main pages for the site
    - `src/pages/about.md`
        - This is a simple page that you can copy that as a template to create new pages
    - `src/posts/`
        - This contains the blog posts for the site
    - `src/posts/example.md`
        - This is an example post and you can copy this as a template to create new blog posts

### Create a Blog Post

- Copy `src/posts/example.md` and create a new blog post `2020-05-11-first-post.md`
- Enter the appropriate information for the Title, Author, etc.
- Write a short blog post in markdown

### Commit and Push to Deploy

- Commit the changes with vscode
- Push the changes
- Wait for the update
- Visit Netlify Config Page for the blog to see status
    - Look on the side to see "Production Deploys"
- View the blog post on the internet

