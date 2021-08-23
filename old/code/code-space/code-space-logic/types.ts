export type CodeSpaceNode = {
    kind: 'filePath' | 'fileContent' | 'contentMatch';
    id: string;
    text: string;
    links: CodeSpaceLink[];
};

export type CodeSpaceLink = {
    a: CodeSpaceReference;
    b: CodeSpaceReference;
};

export type CodeSpaceReference = {
    node: CodeSpaceNode;
    range?: { index: number, length: number };
};
