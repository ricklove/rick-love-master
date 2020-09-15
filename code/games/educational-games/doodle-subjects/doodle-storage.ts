import { DoodleDrawing, DoodleWithPrompt } from 'doodle/doodle';
import { randomIndex, randomItem } from 'utils/random';
import { shuffle } from 'utils/arrays';
import { DoodleDrawingStorageService } from '../doodle';

const storageAccess = {
    load: (): DoodleWithPrompt[] => {
        try {
            return JSON.parse(localStorage.getItem(`_doodleDrawings`) ?? `NULL!{}`);
        } catch{ return []; }
    },
    save: (value: DoodleWithPrompt[]) => {
        localStorage.setItem(`_doodleDrawings`, JSON.stringify(value));
    },
};

export const createDoodleDrawingStorageService = () => {

    const memory = {
        drawings: [] as DoodleWithPrompt[],
    };
    memory.drawings = storageAccess.load();

    const service: DoodleDrawingStorageService = {
        saveDrawing: async (drawing, prompt) => {
            memory.drawings.push({ drawing, prompt });
            storageAccess.save(memory.drawings);
        },
        getDrawings: async (prompt, options) => {
            const {
                includeOtherPrompts = false,
                maxCount = 4,
            } = options ?? {};

            const samePromptDrawings = memory.drawings.filter(x => x.prompt === prompt);
            const otherPromptDrawings = includeOtherPrompts ? memory.drawings.filter(x => x.prompt !== prompt) : [];
            const allDrawings = includeOtherPrompts
                ? [randomItem(samePromptDrawings), ...shuffle(otherPromptDrawings).slice(0, maxCount - 1)]
                : samePromptDrawings;
            const drawings = shuffle(allDrawings).slice(0, maxCount);
            return { drawings };
        },
    };

    return service;
};
