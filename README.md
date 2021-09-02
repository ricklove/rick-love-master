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
  - [ ] Find all references only works inside module and down into dependencies
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
- [x] Typescript stress test
  - [x] Typescript uses .d.ts files instead of reanalyzing all code
  - [x] Typescript uses independent typescript.json settings for each package's code

## Comparison with typescript paths

- Better than typescript paths
  - Editor Performance
    - rush build:watch updates are detected by vscode in a few seconds
    - F12 navigation is very reliable
    - Formatting is quick and reliable
    - Editor is stable, not requiring many reloads
    - typescript paths would often overload tsserver and break, had to manually disable some paths, etc.
  - Targetted Builds (only build specific projects)
    - rush makes it possible to build:watch only specific targets with the `rush build:watch --to project-name`
  - Targetted Includes (only include specific ts files)
    - It is possible to only include specific files for a project
  - Specific project dependencies
    - It is possible to define specific environment targets and libraries (node vs dom, etc.)
  - Enforced separation of environments
    - This leads to smaller more precise modules
  - Many small modules
    - Modules are more likely to be small and include separate modules for each environment target:
      - feature-common (types and config)
      - feature-client
      - feature-server
    - This forces the module to be at a more granular level (at the level where multiple enviroments are needed)
  - Custom build scripts
    - build scripts per project
- Worse than typescript paths
  - cross-project rename
  - find all references worked better (sometimes)
  - much more project boilerplate:
    - config/rig.json
    - src
    - .eslintrc.cjs
    - index.ts
    - package.json
    - tsconfig.json
  - auto imports doesn't work (unless already imported)

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
