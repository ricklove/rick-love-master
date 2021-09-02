This is where I put all the cool stuff.

## Commands

- develop blog
  - Tab1 - Run rush build watch
    - `rush build:watch --to-except blog-nextjs`
  - Tab2 - Run nextjs dev
    - `cd \projects\blog-nextjs`
    - `npx next dev`

## Tech Stack

- rushjs monorepo
  - finally a tool that let's all the config junk to be out of the way instead of the root!
- nextjs for web sites
- react for web components
- typescript for most code

## Dev features

- [Partial] Refactoring across packages
  - [x] F12 Navigation to definition works
  - [ ] Find all references only works inside module
  - [ ] Renaming across packages is not working, but possibly ok
- [x] Shared configuration
- Dependencies
  - [x] Single declaration of dependencies
  - [x] Enforced declaration of dependencies
  - [x] don't pollute auto complete namespace
  - [FAIL] automatic registration of packages
    - rush requires listing packages in rush.json
    - [x] Single registration of packages
      - No need to register typescript registrations
- [ ] Typescript stress test
  - [x] Typescript uses .d.ts files instead of reanalyzing all code
  - [x] Typescript uses independent typescript.json settings for each package's code

## File Structure

- `projects`

  - everything starts as a project
  - specific functionality
    - could become an individual git repo
    - dynamic and hard to define -> flexible organization
    - composed of features & content
    - Private License (original IP)
  - examples:
    - art/artwork/clock-121
    - art/artwork/art-index
    - games/dork
  - parts
    - example:
      - web/blog/app-nextjs
      - web/blog/blog-posts
      - web/blog/blog-pages
    - main project
      - minimal code
      - platform agnostic
    - boilerplate project
      - produces a deployable output
      - platform boilerplate files and configurations
      - e.g.
        - next.js
        - react native
        - serverless framework

- `features`

  - features come from projects
  - generic functionality
    - could become public npm packages
    - minimalistic
    - many and unique -> flat organization
    - MIT License
  - examples:
    - artwork
    - art-gallery
    - pixel-art-generator
    - canvas-recorder
    - terminal-emulator
    - payment-processing
    - authentication

- `_deploy`

  - permanent location of pre-built output artifacts needed for CD (like netlify git deploy)

## License

_tl;dr Don't copy my blog content, lessons, games, or art, but any source code is available under MIT_

The blog content, lessons, games, art, or any other non-source code contained inside this repo is _Not Licensed_ for any use. However, source code is licensed under the MIT license - unless otherwise stated in the root of any package directory.
