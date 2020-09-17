/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Platform, ActivityIndicator } from 'react-native-lite';
import { createDoodleDrawingStorageService } from 'doodle/doodle-storage';
import { DoodleDrawingStorageService } from 'doodle/doodle';
import { useAutoLoadingError } from 'utils-react/hooks';
import { EducationalGame_Doodle } from '../doodle-game';
import { createSpeechService } from '../utils/speech';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';
import { VoiceChooser } from '../utils/voice-chooser';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';

export const EducationalGame_Doodle_Spelling = (props: {}) => {
    const speechService = useRef(createSpeechService());
    const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);

    const { loading, error, doWork } = useAutoLoadingError();
    const drawingStorage = useRef(null as null | DoodleDrawingStorageService);
    useEffect(() => {
        doWork(async (stopIfObsolete) => {
            drawingStorage.current = await createDoodleDrawingStorageService();
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

    if (loading || !drawingStorage.current) {
        return (
            <>
                <ActivityIndicator size='large' color='#FFFF00' />
            </>
        );
    }

    return <EducationalGame_Doodle
        problemService={createAutoSavedProblemService(createReviewProblemService(createSpellingProblemService({ speechService: speechService.current, sectionSize: 8 }), {}), `ProblemsSpellingDoodle`)}
        drawingStorage={drawingStorage.current}
    />;
};
