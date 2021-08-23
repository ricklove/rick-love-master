import { TodoData } from './types';

const delay = (timeMs = 0) => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeMs);
    });
};

const simulateNetwork = async () => {
    await delay(250);
};

/** Create a mock api service that uses localStorage and simulates a network delay */
const createApiService = () => {

    const DATA_KEY = `todo`;

    const service = {
        loadData: async () => {
            await simulateNetwork();
            try {
                const json = localStorage.getItem(DATA_KEY);
                if (!json) { return null; }
                return JSON.parse(json) as TodoData;
            } catch {
                return null;
            }
        },
        saveData: async (data: TodoData) => {
            await simulateNetwork();
            localStorage.setItem(DATA_KEY, JSON.stringify(data));
        },
    };
    return service;
};

export const apiService = createApiService();
