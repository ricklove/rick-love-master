import React, { useState, useEffect } from 'react';
import { DoodleDisplayView, DoodleDrawerView } from 'doodle/doodle-view';
import { defaultDoodleDrawing, DoodleDrawing, DoodleWithPrompt } from 'doodle/doodle';
import { View, Text, TouchableOpacity } from 'react-native-lite';
import { useAutoLoadingError } from 'utils-react/hooks';
import { ProblemService, Problem } from './problems/problems-service';
import { SubjectNavigator } from './utils/subject-navigator';

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
    promptView: {
        justifyContent: `center`,
        alignItems: `center`,
    },
    promptText: {
        fontSize: 20,
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


export type DoodleDrawingStorageService = {
    saveDrawing: (drawing: DoodleDrawing, prompt: string) => Promise<void>;
    getDrawings: (prompt: string, options?: { includeOtherPrompts?: boolean, maxCount?: number }) => Promise<{ drawings: DoodleWithPrompt[] }>;
    // saveSelection: (drawing:DoodleDrawing)
};

export const EducationalGame_Doodle = (props: { problemService: ProblemService, drawingStorage: DoodleDrawingStorageService }) => {
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

export const EducationalGame_Doodle_Inner = (props: { problemService: ProblemService, drawingStorage: DoodleDrawingStorageService, problemSourceKey: number }) => {

    const [problem, setProblem] = useState(null as null | Problem);
    const [mode, setMode] = useState(`drawPrompt` as 'drawPrompt' | 'chooseCorrect' | 'chooseBest');
    const [drawings, setDrawings] = useState(null as null | DoodleWithPrompt[]);
    const prompt = problem?.answers.find(x => x.isCorrect)?.value ?? ``;

    const gotoNextProblem = () => {
        const p = props.problemService.getNextProblem();
        if (!p.question) { return; }
        setProblem(p);
        setMode(`drawPrompt`);
        p.onQuestion?.();
    };

    useEffect(() => {
        gotoNextProblem();
    }, [props.problemSourceKey]);

    const { loading, error, doWork } = useAutoLoadingError();

    const onDrawingDone = (drawing: DoodleDrawing) => {
        // props.onDone(drawing);

        // Save drawing with word prompt
        doWork(async (stopIfObsolete) => {
            if (drawing.segments.length > 0) {
                await props.drawingStorage.saveDrawing(drawing, prompt);
            }
            stopIfObsolete();

            const result = await props.drawingStorage.getDrawings(prompt);

            if (result.drawings.length <= 1) {
                gotoNextProblem();
                return;
            }

            setDrawings(result.drawings);
            setMode(`chooseBest`);
        });
    };

    const onChooseBest = (value: DoodleWithPrompt) => {
        gotoNextProblem();
    };

    if (!problem) {
        return (
            <>
            </>
        );
    }

    if (mode === `chooseBest` && drawings) {
        return (
            <>
                <DoodleGameView_ChooseBest prompt={prompt} drawings={drawings} onChooseBest={onChooseBest} />
            </>
        );
    }

    return (
        <>
            <DoodleGameView_DrawWord prompt={prompt} onDone={onDrawingDone} />
            {/* <DoodleDisplayView style={styles.drawing} drawing={defaultDoodleDrawing()} /> */}
        </>
    );
};

export const DoodleGameView_DrawWord = (props: { prompt: string, onDone: (drawing: DoodleDrawing) => void }) => {
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
            <DoodleDrawerView style={styles.drawing} drawing={drawing} onChange={changeDoodle} />
            <View style={styles.promptView}>
                <Text style={styles.promptText}>{props.prompt}</Text>
            </View>
            <TouchableOpacity onPress={done}>
                <View style={styles.buttonView}>
                    <Text style={styles.buttonText}>Done</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export const DoodleGameView_ChooseBest = (props: { prompt: string, drawings: DoodleWithPrompt[], onChooseBest: (drawing: DoodleWithPrompt) => void }) => {
    return (
        <View style={styles.container}>
            <View style={styles.promptView}>
                <Text style={styles.promptText}>{props.prompt}</Text>
            </View>
            <View style={styles.drawingChoicesView} >
                {props.drawings.map(x => (
                    <TouchableOpacity onPress={() => props.onChooseBest(x)}>
                        <View style={styles.drawingChoiceWrapper} >
                            <DoodleDisplayView style={styles.drawingChoice} drawing={x.drawing} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
