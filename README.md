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
- [ ] vscode supports cross-project debug
    - [x] Break at Exception in any project level
    - [FAIL] Breakpoints work at any project level
- [ ] Shared/Single tsconfig
- [ ] Shared/Single eslint
- [ ] works with expo
- [ ] works with gatsby

