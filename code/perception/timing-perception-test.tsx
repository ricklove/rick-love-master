/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { C } from 'controls-react';
import { delay } from 'utils/delay';

export const TimingPerceptionTestComponent = (props: {}) => {

    const [delayTimeMs, setDelayTimeMs] = useState(250);
    const [target, setTarget] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTarget(true);
            setSuccess(null);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [delayTimeMs]);

    const [success, setSuccess] = useState(null as null | { success: boolean, delayTimeMs: number });

    const onClick = async () => {
        await delay(delayTimeMs);
        setTarget(false);
        setSuccess({ success: true, delayTimeMs });

        if (delayTimeMs < 10) {
            setDelayTimeMs(250);
        } else if (Math.random() < 0.1) {
            setDelayTimeMs(s => 0);
        } else {
            setDelayTimeMs(s => s + 1);
        }
    };

    return (
        <>
            <C.View_Panel>
                <C.View_Form>
                    <C.View_FieldRow>
                        {/* <C.Button_FieldInline onPress={sendInputToOutputs} >Send to Outputs test</C.Button_FieldInline> */}
                    </C.View_FieldRow>
                    <C.View_FieldRow style={{ background: target ? `#00FF00` : `#FF0000` }} >
                        <C.Button_FieldInline onPress={onClick} >{`${target ? `` : `Don't`}Press Button`}</C.Button_FieldInline>
                    </C.View_FieldRow>
                    {success && (
                        <C.View_FieldRow style={{ background: success.success ? `#00FF00` : `#FF0000` }} >
                            <C.Text_FieldLabel>{`${success.success ? `Success ${success.delayTimeMs}` : `Fail`}`}</C.Text_FieldLabel>
                        </C.View_FieldRow>
                    )}
                </C.View_Form>
            </C.View_Panel>
        </>
    );
};
