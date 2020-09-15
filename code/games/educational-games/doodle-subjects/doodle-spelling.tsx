/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState } from 'react';
import { Text, View, Platform } from 'react-native-lite';
import { EducationalGame_Doodle } from '../doodle';
import { createSpeechService } from '../utils/speech';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';
import { VoiceChooser } from '../utils/voice-chooser';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';
import { createDoodleDrawingStorageService } from './doodle-storage';

export const EducationalGame_Doodle_Spelling = (props: {}) => {
    const speechService = useRef(createSpeechService());
    const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);

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

    return <EducationalGame_Doodle
        problemService={createAutoSavedProblemService(createReviewProblemService(createSpellingProblemService({ speechService: speechService.current }), {}), `ProblemsSpelling`)}
        drawingStorage={createDoodleDrawingStorageService()}
    />;
};
