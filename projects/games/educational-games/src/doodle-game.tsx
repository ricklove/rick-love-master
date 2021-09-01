import React, { useState, useEffect, useRef } from 'react';
import { DoodleDrawing, DoodleData, DoodleDrawingStorageService } from 'doodle/doodle';
import { useAutoLoadingError } from 'utils-react/hooks';
import { DoodleGameView_TypeExpected, DoodleGameView_ChooseBest, DoodleGameView_DrawWord } from 'doodle/doodle-components';
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
    buttonRowView: {
        flexDirection: `row`,
    },
    buttonView: {
        margin: 4,
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
    const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

    return (<>
        {!isNavigatorOpen && (<EducationalGame_Doodle_Inner {...props} problemSourceKey={problemSourceKey} />)}
        <SubjectNavigator problemService={props.problemService}
            onOpen={() => setIsNavigatorOpen(true)}
            onClose={() => setIsNavigatorOpen(false)}
            onSubjectNavigation={() => setProblemSourceKey(s => s + 1)}
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

    const sayAgain = () => {
        problem?.speakPrompt?.();
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
    const onDrawingSkip = () => {
        setTimeout(gotoChooseBestMode);
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
                <DoodleGameView_TypeExpected prompt={prompt.current} drawings={drawings ?? []} onDone={onTypeDone} sayAgain={sayAgain} />
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
            <DoodleGameView_DrawWord prompt={prompt.current} hint={problem.hint} onDone={onDrawingDone} onSkip={onDrawingSkip} />
            {/* <DoodleDisplayView style={styles.drawing} drawing={defaultDoodleDrawing()} /> */}
        </>
    );
};
