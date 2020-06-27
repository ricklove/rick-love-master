type MIDIMessageEvent = {
    /** [command, note, velocity] */
    data: [number, number, number];
};
type MidiAccess = {
    inputs: {
        values: () => {
            onmidimessage: (midiMessageEvent: MIDIMessageEvent) => void;
        }[];
    };
    // outputs: [];
};
declare interface Navigator {
    requestMIDIAccess?: () => Promise<MidiAccess>;
}
