/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { C } from 'controls-react';
import { delay } from 'utils/delay';

export const TimingPerceptionTestComponent = (props: {}) => {

    const [delayTimeMs, setDelayTimeMs] = useState(500);
    const [target, setTarget] = useState(null as null | { hit: boolean, topRatio: number, leftRatio: number });

    useEffect(() => {
        const pos = { hit: true, topRatio: Math.random(), leftRatio: Math.random() };
        setTarget(pos);
        setSuccess(null);

        const timeoutId = setTimeout(() => {
            setTarget(s => ({ ...pos, hit: false }));
        }, 500 + 1000 * Math.random());
        return () => clearTimeout(timeoutId);
    }, [delayTimeMs]);

    const [success, setSuccess] = useState(null as null | { success: boolean, delayTimeMs: number });

    const onClick = async () => {
        await delay(delayTimeMs);
        setTarget(null);
        setSuccess({ success: true, delayTimeMs });

        if (delayTimeMs < 10) {
            setDelayTimeMs(500);
        } else if (Math.random() < 0.05) {
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
                    <div style={{ position: `relative`, width: 300, height: 300 }}>
                        {target && (
                            <div style={{ position: `absolute`, top: 270 * target.topRatio, left: 250 * target.leftRatio }}>
                                <C.View_FieldRow style={{ background: target ? `#00FF00` : `#FF0000` }} >
                                    <C.Button_FieldInline onPress={onClick} >{`${target.hit ? `` : `Don't`}Press Button`}</C.Button_FieldInline>
                                </C.View_FieldRow>
                            </div>
                        )}
                    </div>

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
