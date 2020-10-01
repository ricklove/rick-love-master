---
title: "Cool Stuff"
date: "2020-09-30"
path: "/cool-stuff"
author: "Rick Love"
excerpt: "Here is a list of some cool stuff on the site"
---

So, almost all my content is hidden, so this post will highlight some things to play with.


### Introduction to the Site

Basically, this is a website all built in react. It uses a simplified version of gatsby to generate a static website with async loaded components. That is hosted on netlify which basically provides free https, simple dns management, and git deploy with auto CDN cache expiration. In addition, I use serverless framework cli to define my AWS infrastructure and deploy the serverless stuff from command line. Essentially, I can make anything and deploy it in about 30 secs.


### Some Interesting Things

Some interesting things:

- The Site Header
    - Really figure this out. It goes very deep. (try 'dir' or 'ls', also useful: 'open')
    - dork - A text adventure (inside the header console simulator)
        - I'm ofter adding to this. You could spend quite a while getting all the items in the first stage.
- A doodle game for parties (using serverless websockets with AWS Api Gateway, Lambda, and DynamoDB): https://ricklove.me/games/doodle-party?room=visitors
- A bunch of educational games I made for my kids (using AWS lambda and S3 for storage): https://ricklove.me/games
- A code relationship visualizer: https://ricklove.me/tests/code-space
- Components Testing (e.g. Stripe: https://ricklove.me/tests/stripe)
- Hacker News - Front Page https://ricklove.me/tests/hacker-news


### Repo

By the way, all this is in my repo here: https://github.com/ricklove/rick-love-master