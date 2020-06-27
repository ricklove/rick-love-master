export class MidiError extends Error {
    constructor(public message: string, public data?: unknown) { super(); }
}

export enum MidiCommand {
    NoteOff = 128,
    NoteOn = 144,
};

export type MidiInput = {
    command: MidiCommand;

    /** Note value from 0-127
     * 
     * 88 Key Piano: 21=FirstKey, 108=LastKey, 60=MiddleC
     */
    note: number;

    /** Stregth: 1=Softest, 127=Hardest, 0=NoteOff */
    velocity: number;

    event: MIDIMessageEvent;
};
export const createMidiInput = async ({
    onMidiMessage,
}: {
    onMidiMessage: (input: MidiInput) => void;
}) => {

    if (!navigator.requestMIDIAccess) {
        throw new MidiError(`WebMIDI is not supported`);
    }

    const midiAccess = await navigator.requestMIDIAccess();
    const inputs = midiAccess.inputs.values();

    for (const input of inputs) {
        input.onmidimessage = (e => {
            const [command, note, velocity] = e.data;
            onMidiMessage({ command, note, velocity, event: e });
        });
    }
};
