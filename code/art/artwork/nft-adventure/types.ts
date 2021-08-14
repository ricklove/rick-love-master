export type GameStep<TInventory extends string = string> = {
    title: string;
    art?: {
        ascii?: string;
        base64?: string;
    };
    description: string;
    glitch?: {
        ratio: number;
        messages: string[];
    };
    inventory: TInventory[];
    actions: {
        name: string;
        description: string;
        gameOver?: string | false;
    }[];
};
