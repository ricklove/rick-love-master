export type ConCommandResult = { output?: string, addDivider?: boolean, prompt?: string, quit?: boolean, Component?: () => JSX.Element };
export type ConInput = { raw: string, lower: string, command: string, target: string, onMessage: (message: ConCommandResult) => void };

export type ConSessionName = 'user' | 'admin';
export type ConSession = { machineName: string };

export type ConActionQuery = { prompt: string, respond: (input: ConInput) => Promise<ConAction> };
export type ConAction = void | null | undefined | {
    output?: string;
    addDivider?: boolean;
    query?: ConActionQuery;
    Component?: () => JSX.Element;
};
export type ConFile = {
    session: ConSessionName;
    path: string;
    name: string;
    content: string;
    execute?: (onMessage: (message: ConCommandResult) => void) => Promise<ConAction>;
};
export type ConState = {
    readonly parent?: ConState;
    readonly session: ConSessionName;
    readonly directory: string;
    readonly activeAction?: ConAction;
};
