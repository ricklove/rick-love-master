export type CodeSpaceNode = {
    text: string;
    links: CodeSpaceLink[];
};

export type CodeSpaceLink = {
    a: CodeSpaceReference;
    b: CodeSpaceReference;
};

export type CodeSpaceReference = {
    node: CodeSpaceNode;
    range: { start: number, length: number };
};
