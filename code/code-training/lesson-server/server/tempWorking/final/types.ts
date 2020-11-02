export type TodoData = {
    items: TodoItemData[];
};

export type TodoItemData = {
    key: string;
    text: string;
    isDone: boolean;
};
