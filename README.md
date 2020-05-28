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

## Option: Yarn Workspaces (Current)

- [FAIL] Only Relevant Code is visible in a specific project
    - [FAIL] No config files needed
        - Still needs packages.json
        - Still needs tsconfig.json
    - [FAIL] Ability to separate config from code with src
        - Causes ugliness in imports 
    - This can be somewhat corrected with vscode workspace hiding files, but not ideal
- [x] Code folders have a simple well defined structure
- [PARTIAL] vscode supports cross-project navigation
    - [x] Go to definition works
    - [PARTIAL] Find all references fails sometimes
- [PARTIAL] vscode supports cross-project rename
     - [PARTIAL] Rename fails sometimes 
        - usually when renaming from usage
        - other times, probably the same time when find all reference fails
- [x] vscode supports cross-project debug
    - [x] Break at Exception in any project level
    - [x] Breakpoints work at any project level
- [x] Shared/Single tsconfig
    - [FAIL] Only root tsconfig
        - [FAIL] Breaks Eslint => Each package must have a tsconfig.json, but it can just be an extends
    - [x] Support extends to root tsconfig
- [x] Shared/Single eslint
- [x] works with gatsby
- [ ] works with expo
- [ ] works with create react app

- [x] Import typsecript directly module without index or extra path
    - The only way to do this now is to not use a 'src' folder in the package
    - vscode can be used to hide the extra files

### Evalation with Ideal Features

- [F] vscode works in every case
    - [F] Goto Definition always works
    - [F] Find all references always works
    - [F] Rename changes all instances
- [F] Single Default Config
    - [x] Single .eslintrc.js
    - [Partial - Extends] Single tsconfig.json
    - [F] Single pacakges.json
- [x] Special Config
    - [x] Override config by placing own version in folder
- [ ] Separation of code from boilerplate
    - [ ] Ability to define all code without any boilerplate files
    - [ ] Boilerplate projects can be isolated
    - [ ] Customizations of boilerplate can be separated from default boilerplate


## Option: Code Folder - with `sync.ts` (G.T. setup)

- [x] code folder contains just code
- [FAIL] no config
    - Requires a custom script that lists folders to include in syncing with project/client/src
    
- [FAIL] development sync is fast
    - [x] Code syncing is fast
    - Rollup part is part of the code syncing and slows it down - deployment scripts that use rollup and other build should be separated

- [FAIL] debugging points to original code
    - [FAIL] debugging points to copy of code and resulted in edits in wrong files a few times

## Option: Code Folder with Advanced Build (Current)

- [x] vscode works in every case
    - [x] Typescript
        - [x] Goto Definition always works
        - [x] Find all references always works
        - [x] Rename changes all instances
        - [x] Auto import always works
- [x] Single Default Config
    - [x] Single .eslintrc.js
    - [x] Single tsconfig.json
    - [x] Single package.json
        - Hydrate/Dehydrate generated package.json for runtime (Not needed for ts-node runs using tsconfig-paths)
- [x] Special Config
    - [x] Override config by placing own version in folder
        - Hydrate/Dehydrate can work with custom config
- [x] Separation of code from boilerplate
    - [x] Ability to define all code without any boilerplate files
    - [x] Boilerplate projects can be isolated
    - [x] Customizations of boilerplate can be separated from default boilerplate
        - Using template.json with a build script, templates/projects can be separated
- [ ] Optional Dependency Versioning
    - [ ] Dependencies can optionally be modified while allowing dependants to continue to use an old version
    - [ ] Dependants can be reconciled to an updated version of the dependency at their own convenience
- [x] Multi-Repo
    - [x] Code can be synced with multiple repos
    - [x] Optional Blind code ownership, code can be copied into target repo and has no dependencies on master repo
        - Code can be copied and tranformed to any target path
        - Code can also be copied from a target path and transformed in project
- [ ] Multi-Config
    - [ ] Code can be synced into a target that uses a different tsconfig
    - [ ] Code can be synced into a target that uses a different eslint
    - [ ] Code can be automatically formatted with target config tools (i.e. auto run eslint --fix)
        - Note: This would require being able to run a command at the target path
- [x] Free Project structure
    - [x] Possible to have packages in catagory folders or nested (i.e. packages/ games/ projects/)
        - Convention currently identifies packages as any folder that contains a `src/` folder
        - Another possible convention could be: the parentmost folder (under root) that contains a source code file (*.ts/*.tsx)
- [ ] Languange/Project/Environment/Target Agnostic
    - [ ] Tools can work with any code or framework
        - Typescript, C#, Python, etc.
- [ ] Config files in isolated folder (i.e. .config/ folder)
    - [ ] Config files do not have to live in the root of the project, but can live out of the way in their own folder
        - It is possible to extract config files from root, but that would potentially break the scripts
        - With a globally installed cli tool, it would be possible to hydrate/dehydrate config files out from the root


## Ideal Features

- [ ] vscode works in every case
    - [ ] Goto Definition always works
    - [ ] Find all references always works
    - [ ] Rename changes all instances
    - [ ] Auto import always works
- [ ] Single Default Config
    - [ ] Single .eslintrc.js
    - [ ] Single tsconfig.json
    - [ ] Single package.json
- [ ] Special Config
    - [ ] Override config by placing own version in folder
- [ ] Separation of code from boilerplate
    - [ ] Ability to define all code without any boilerplate files
    - [ ] Boilerplate projects can be isolated
    - [ ] Customizations of boilerplate can be separated from default boilerplate
- [ ] Optional Dependency Versioning
    - [ ] Dependencies can optionally be modified while allowing dependants to continue to use an old version
    - [ ] Dependants can be reconciled to an updated version of the dependency at their own convenience
- [ ] Multi-Repo
    - [ ] Code can be synced with multiple repos
    - [ ] Optional Blind code ownership, code can be copied into target repo and has no dependencies on master repo
- [ ] Multi-Config
    - [ ] Code can be synced into a target that uses a different tsconfig
    - [ ] Code can be synced into a target that uses a different eslint
    - [ ] Code can be automatically formatted with target config tools (i.e. auto run eslint --fix)
- [ ] Free Project structure
    - [ ] Possible to have packages in catagory folders (i.e. packages/ games/ projects/)
- [ ] Languange/Project/Environment/Target Agnostic
    - [ ] Tools can work with any code or framework
        - Typescript, C#, Python, etc.
- [ ] Config files in isolated folder (i.e. .config/ folder)
    - [ ] Config files do not have to live in the root of the project, but can live out of the way in their own folder

### Implementation Options

#### Option: Symlinks (Fail)

- Symlinks do not support code transformations

#### Option: 2-Way Sync with Code Transformations

- Multiple copies of files is possible
- Both Versions of the source code become part of git, which allows diff in either context
- Independent git repos are possible
- This can work with anything, files are just files
- Repos don't have to sync everything, either side could have custom code or independent files
- Dependencies could be generated and listed, diff'ed, etc.
- Project templates could be used for hosting code
    - Gatsby, Expo, React Native, etc.

### Use Case

#### Dork doesn't want external dependencies for minor files

- dork needs to use util/delay.ts
- copy/paste is a simple enough solution, but that creates a copy of that for every project
- injection of that file into the dork project would be ideal


---

## Useful Commands:

- print eslint rules
    `npx eslint --print-config .\src\_.ts > .eslint-all-rules.debug.json`
- print eslint files linted
    `npx eslint --debug`
    `npx eslint --ext js,jsx,ts,tsx code --debug`
- Convert JS to TSX (and convert prop-types)
    `npx react-proptypes-to-typescript "./src/**/*.js" --remove-original-files`
- Fix all files with eslint
    `npx eslint --ext js,jsx,ts,tsx src --fix`
- Find depedency used in node_modules (bash)
    `find ./node_modules/ -name package.json | xargs grep <the_package_name>`

- Display Dependencies
    `depcruise --ts-config --exclude "^node_modules" --output-type dot code | dot -T svg > dependencygraph.svg`


## License

*tl;dr Don't copy my blog content, games, or art, but any source code is available under MIT*

The blog content, games, art, or any other non-source code contained inside this repo is *Not Licensesed* for any use. However, source code is licensed under the MIT license - unless otherwise stated in the root of any package directory.

