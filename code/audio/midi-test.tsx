/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { C } from 'controls-react';
import { useAutoLoadingError } from 'utils-react/hooks';
import { delay } from 'utils/delay';
import { createMidiInput } from './web-midi-input';

export const MidiTestComponent = (props: {}) => {

    const { loading, error, doWork } = useAutoLoadingError();
    const [messages, setMessages] = useState([] as string[]);
    const enableMidi = () => doWork(async () => {
        await createMidiInput({
            onMidiMessage: (input) => {
                setMessages(s => [JSON.stringify(input), ...s]);
            },
        });
    });

    const sendInputToOutputs = () => doWork(async () => {
        let sendOutput = async (data: [number, number, number]) => { };
        const result = await createMidiInput({
            onMidiMessage: (input) => {
                (async () => { await sendOutput(input.event.data); })();
                setMessages(s => [JSON.stringify(input), ...s]);
            },
        });

        const { outputs } = result;
        sendOutput = async (data) => {
            for (const o of outputs) {
                await delay(500);
                o.send(data);
            }
        };
    });

    return (
        <>
            <C.View_Panel>
                <C.Loading loading={loading} />
                <C.ErrorBox error={error} />
                <C.View_Form>
                    <C.View_FieldRow>
                        <C.Button_FieldInline onPress={enableMidi} >Enable Midi</C.Button_FieldInline>
                        <C.Button_FieldInline onPress={sendInputToOutputs} >Send to Outputs test</C.Button_FieldInline>
                    </C.View_FieldRow>
                    {messages.map((x, i) => (
                        <C.View_FieldRow key={`${i - 1 + 1}`}>
                            <C.Text_FieldLabel>{x}</C.Text_FieldLabel>
                        </C.View_FieldRow>
                    ))}
                </C.View_Form>
            </C.View_Panel>
        </>
    );
};
