/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Platform, ActivityIndicator } from 'react-native-lite';
import { createDoodleDrawingStorageService } from 'doodle/doodle-storage';
import { DoodleDrawingStorageService } from 'doodle/doodle';
import { useAutoLoadingError } from 'utils-react/hooks';
import { Problem } from '../problems/problems-service';
import { EducationalGame_Doodle, DoodleProblemService } from '../doodle-game';
import { createSpeechService } from '../utils/speech';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';
import { VoiceChooser } from '../utils/voice-chooser';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';

export const EducationalGame_Doodle_Spelling = (props: {}) => {
    const speechService = useRef(createSpeechService());
    const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);

    const { loading, error, doWork } = useAutoLoadingError();
    const drawingStorage = useRef(null as null | DoodleDrawingStorageService);
    const problemService = useRef(null as null | DoodleProblemService);
    useEffect(() => {
        doWork(async (stopIfObsolete) => {
            drawingStorage.current = await createDoodleDrawingStorageService();
            stopIfObsolete();

            const inner = createAutoSavedProblemService(createSpellingProblemService({ speechService: speechService.current, sectionSize: 8 }), `ProblemsSpellingDoodle`);
            let lastProblem = null as null | Problem;
            problemService.current = {
                getSections: inner.getSections,
                gotoSection: inner.gotoSection,
                getNextProblem: () => {
                    if (lastProblem) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        inner.recordAnswer(lastProblem, lastProblem.answers.find(x => x.isCorrect)!);
                    }

                    const p = inner.getNextProblem();
                    if (!p.question) { return null; }
                    lastProblem = p;

                    return {
                        prompt: p.answers.find(x => x.isCorrect)?.value ?? ``,
                        // hint: p.question,
                        speakPrompt: p.onQuestion,
                    };
                },
            };
        });
    }, []);

    // Only web
    if (!hasStarted) {
        const speak = () => { speechService.current.speak(`Start`); setHasStarted(true); };
        return (
            <View>
                <VoiceChooser languange='en' speechService={speechService.current} />
                <div onClick={() => speak()}>
                    <View style={{ height: 300, alignSelf: `center`, alignItems: `center`, justifyContent: `center` }}>
                        <Text style={{ fontSize: 36 }}>Start</Text>
                    </View>
                </div>
            </View>
        );
    }

    if (loading || !drawingStorage.current || !problemService.current) {
        return (
            <>
                <ActivityIndicator size='large' color='#FFFF00' />
            </>
        );
    }

    return <EducationalGame_Doodle
        problemService={problemService.current}
        drawingStorage={drawingStorage.current}
    />;
};
