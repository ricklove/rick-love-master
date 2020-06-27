import { distinct } from 'utils/arrays';

export type MidiInput = {
    frequency: number;
};
export const createMidiInput = (options: {
    onKeyDown: (input: MidiInput) => void;
    onKeyUp: (input: MidiInput) => void;
}) => {

    const test = distinct([1, 2]);
    return test;
};
