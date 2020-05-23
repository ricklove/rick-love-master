This is where I put all the cool stuff.

# Folder Structure

- packages
    - Everything is a package
    - This is where all the source code lives with it's necessary configuration
    - A package can be a node module, content files, or something else
    - Keep this folder flat and each package flat, avoid nested packages
- workspaces
    - This is mainly ide files
    - Each folder contains a .code-workspace that lists all the dependencies for that project
    - These workspaces are what enables the packages to be flat and a long list, while allowing the ide to be clean


# Development Features

- [x] Only Relevant Code is visible in a specific project
- [x] Code folders have a simple well defined structure
- [x] vscode supports cross-project navigation 
- [x] vscode supports cross-project rename
- [x] vscode supports cross-project debug
    - [x] Break at Exception in any project level
    - [x] Breakpoints work at any project level
- [x] Shared/Single tsconfig
    - [x] Only root tsconfig
        - [FAIL] Breaks Eslint => Use Extends
    - [x] Support extends to root tsconfig
- [x] Shared/Single eslint
- [ ] works with expo
- [ ] works with gatsby


## Useful Commands:

- print eslint rules
    `npx eslint --print-config .\src\_.ts > .eslint-all-rules.debug.json`
- print eslint files linted
    `npx eslint --debug`
- Convert JS to TSX (and convert prop-types)
    `npx react-proptypes-to-typescript "./src/**/*.js" --remove-original-files`
- Fix all files with eslint
    `npx eslint --ext js,jsx,ts,tsx src --fix`
- Find depedency used in node_modules (bash)
    `find ./node_modules/ -name package.json | xargs grep <the_package_name>`