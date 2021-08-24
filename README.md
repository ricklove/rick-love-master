This is where I put all the cool stuff.

## Tech Stack

- rushjs monorepo
  - finally a tool that let's all the config junk to be out of the way instead of the root!
- nextjs for web sites
- react for web components
- typescript for most code

## File Structure

- packages
  - all the code is here
- projects
  - output projects are here
  - platform boilerplate files and configurations
  - e.g.
    - next.js
    - react native
    - serverless framework
  - no code
    - this should contain only minimal custom code in order to references the required packages
    - even build scripts, etc. should be in packages and written in a tool-agnostic way

## License

_tl;dr Don't copy my blog content, lessons, games, or art, but any source code is available under MIT_

The blog content, lessons, games, art, or any other non-source code contained inside this repo is _Not Licensed_ for any use. However, source code is licensed under the MIT license - unless otherwise stated in the root of any package directory.
