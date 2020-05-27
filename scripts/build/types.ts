
export type PackageJson = {
    name: string;
    dependencies: { [name: string]: string };
    devDependencies?: { [name: string]: string };
    peerDependencies?: { [name: string]: string };
    workspaces?: string[];
};
