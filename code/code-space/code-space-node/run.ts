import { loadCodeBase } from '../code-space-logic/load-code-base';

export const run = async () => {
    await loadCodeBase(`../../../code`);
};
