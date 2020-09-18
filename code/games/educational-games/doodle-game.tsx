import React, { useState, useEffect, useRef } from 'react';
import { DoodleDisplayView, DoodleDrawerView } from 'doodle/doodle-view';
import { defaultDoodleDrawing, DoodleDrawing, DoodleData, DoodleDrawingStorageService } from 'doodle/doodle';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { useAutoLoadingError } from 'utils-react/hooks';
import { SubjectNavigator } from './utils/subject-navigator';
import { KeyboardSimplified } from './utils/keyboard-simplified';

export const styles = {
    container: {
        alignItems: `center`,
    },
    drawing: {
        width: 312,
        height: 312,
        color: `#FFFFFF`,
        backgroundColor: `#000000`,
    },
    drawingChoicesView: {
        maxWidth: 312 + 4 * 4 + 4,
        flexDirection: `row`,
        flexWrap: `wrap`,
    },
    drawingChoiceWrapper: {
        padding: 4,
    },
    drawingChoice: {
        width: 78,
        height: 78,
        color: `#FFFFFF`,
        backgroundColor: `#000000`,
    },
    titleView: {
        justifyContent: `center`,
        alignItems: `center`,
    },
    titleText: {
        fontSize: 20,
        color: `#FFFFFF`,
    },
    promptView: {
        justifyContent: `center`,
        alignItems: `center`,
    },
    promptText: {
        fontSize: 20,
        color: `#FFFF00`,
    },
    hintText: {
        fontSize: 14,
        color: `#FFFF00`,
    },
    buttonView: {
        padding: 8,
        backgroundColor: `#111111`,
    },
    buttonText: {
        fontSize: 20,
        color: `#FFFF00`,
    },
} as const;

export type DoodleProblemService = {
    getSections: () => { key: string, name: string, isComplete: boolean }[];
    gotoSection: (section: { key: string }) => void;
    getNextProblem: () => DoodleProblem | null;
};
type DoodleProblem = {
    prompt: string;
    hint?: string;
    speakPrompt?: () => void;
};

export const EducationalGame_Doodle = (props: { problemService: DoodleProblemService, drawingStorage: DoodleDrawingStorageService }) => {
    const [problemSourceKey, setProblemSourceKey] = useState(0);

    return (<>
        <EducationalGame_Doodle_Inner {...props} problemSourceKey={problemSourceKey} />
        <SubjectNavigator problemService={props.problemService}
            onOpen={() => { }}
            onClose={() => { }}
            onSubjectNavigation={() => { setProblemSourceKey(s => s + 1); }}
        />
    </>);
};

export const EducationalGame_Doodle_Inner = (props: { problemService: DoodleProblemService, drawingStorage: DoodleDrawingStorageService, problemSourceKey: number }) => {

    const [problem, setProblem] = useState(null as null | DoodleProblem);
    const [mode, setMode] = useState(`type` as 'type' | 'drawPrompt' | 'chooseCorrect' | 'chooseBest');
    const [drawings, setDrawings] = useState(null as null | DoodleData[]);
    const prompt = useRef(problem?.prompt ?? ``);
    prompt.current = problem?.prompt ?? ``;

    const gotoNextProblem = () => {
        const p = props.problemService.getNextProblem();
        if (!p) { return; }
        setProblem(p);
        setTimeout(gotoTypeMode);
        p.speakPrompt?.();
    };

    useEffect(() => {
        gotoNextProblem();
    }, [props.problemSourceKey]);

    const { loading, error, doWork } = useAutoLoadingError();

    const gotoTypeMode = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.drawingStorage.getDrawings(prompt.current, { maxCount: 1, includeOtherPrompts: false });
            setDrawings(result.doodles);
            setMode(`type`);
        });
    };

    const onTypeDone = () => {
        doWork(async (stopIfObsolete) => {
            setTimeout(gotoDrawPromptMode);
        });
    };

    const gotoDrawPromptMode = () => {
        setMode(`drawPrompt`);
    };

    const onDrawingDone = (drawing: DoodleDrawing) => {
        // props.onDone(drawing);

        // Save drawing with word prompt
        doWork(async (stopIfObsolete) => {
            if (drawing.segments.length > 0) {
                await props.drawingStorage.saveDrawing(prompt.current, drawing);
            }
            stopIfObsolete();
            setTimeout(gotoChooseBestMode);
        });
    };

    const gotoChooseBestMode = () => {
        doWork(async (stopIfObsolete) => {
            const result = await props.drawingStorage.getDrawings(prompt.current);
            stopIfObsolete();

            if (result.doodles.length <= 1) {
                gotoNextProblem();
                return;
            }

            setDrawings(result.doodles);
            setMode(`chooseBest`);
        });
    };

    const onChooseBest = (value: DoodleData) => {
        doWork(async (stopIfObsolete) => {
            await props.drawingStorage.saveBestDrawingSelection(value);
            stopIfObsolete();
            gotoNextProblem();
        });
    };


    if (!problem) {
        return (
            <>
            </>
        );
    }

    if (mode === `type`) {
        return (
            <>
                <DoodleGameView_Type prompt={prompt.current} drawings={drawings ?? []} onDone={onTypeDone} />
            </>
        );
    }

    if (mode === `chooseBest` && drawings) {
        return (
            <>
                <DoodleGameView_ChooseBest prompt={prompt.current} drawings={drawings} onChooseBest={onChooseBest} />
            </>
        );
    }

    return (
        <>
            <DoodleGameView_DrawWord prompt={prompt.current} hint={problem.hint} onDone={onDrawingDone} />
            {/* <DoodleDisplayView style={styles.drawing} drawing={defaultDoodleDrawing()} /> */}
        </>
    );
};

export const DoodleGameView_DrawWord = (props: { prompt: string, hint?: string, onDone: (drawing: DoodleDrawing) => void }) => {
    const [drawing, setDrawing] = useState(defaultDoodleDrawing());
    const changeDoodle = (value: DoodleDrawing) => {
        setDrawing(value);
    };

    const done = () => {
        props.onDone(drawing);
    };

    useEffect(() => {
        // Reset problem when prompt changes
        setDrawing(defaultDoodleDrawing());
    }, [props.prompt]);

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Draw</Text>
            </View>
            <DoodleDrawerView style={styles.drawing} drawing={drawing} onChange={changeDoodle} />
            <View style={styles.promptView}>
                <Text style={styles.promptText}>{props.prompt}</Text>
                {!!props.hint && (<Text style={styles.hintText}>{props.hint}</Text>)}
            </View>
            <TouchableOpacity onPress={done}>
                <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>Done</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export const DoodleGameView_ChooseBest = (props: { prompt: string, drawings: DoodleData[], onChooseBest: (drawing: DoodleData) => void }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Choose Best</Text>
            </View>
            <View style={styles.promptView}>
                <Text style={styles.promptText}>{props.prompt}</Text>
            </View>
            <View style={styles.drawingChoicesView} >
                {props.drawings.map(x => (
                    <TouchableOpacity key={x.key} onPress={() => props.onChooseBest(x)}>
                        <View style={styles.drawingChoiceWrapper} >
                            <DoodleDisplayView style={styles.drawingChoice} drawing={x.drawing} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const typeStyles = {
    completedText: {
        fontSize: 16,
        color: `#FFFF00`,
    },
} as const;
export const DoodleGameView_Type = (props: { prompt: string, drawings: DoodleData[], onDone: () => void }) => {

    const [status, setStatus] = useState({ completed: ``, remaining: props.prompt });
    useEffect(() => {
        setStatus({ completed: ``, remaining: props.prompt });
    }, [props.prompt, props.drawings]);

    const onExpectedKeyPress = () => {
        setStatus(s => {
            if (s.remaining.length <= 1) {
                props.onDone();
            }
            const nextChar = s.remaining[0];
            return {
                completed: s.completed + nextChar,
                remaining: s.remaining.substr(1),
            };
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleView}>
                <Text style={styles.titleText}>Type Word</Text>
            </View>
            <View style={styles.drawingChoicesView} >
                {props.drawings.map(x => (
                    <View key={x.key} style={styles.drawingChoiceWrapper} >
                        <DoodleDisplayView style={styles.drawingChoice} drawing={x.drawing} />
                    </View>
                ))}
            </View>
            <View>
                <Text style={typeStyles.completedText}>{`${status.completed}${status.remaining.length > 0 ? `_` : ``}`}</Text>
            </View>
            <KeyboardSimplified expectedCharacter={status.remaining[0] ?? ` `} showHints onExpectedKeyPress={onExpectedKeyPress} />
        </View>
    );
};
