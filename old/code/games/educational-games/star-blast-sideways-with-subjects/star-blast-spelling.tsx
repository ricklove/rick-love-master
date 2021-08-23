/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Platform } from 'react-native-lite';
import { ProblemService } from '../problems/problems-service';
import { createFunnySpellingResponsesProblemService } from '../problems/spelling/spelling-funny-response-problem-services';
import { createSpeechService } from '../utils/speech';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';
import { VoiceChooser } from '../utils/voice-chooser';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';

export const EducationalGame_StarBlastSideways_Spelling = (props: {}) => {
    const speechService = useRef(createSpeechService());
    const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);
    const problemService = useRef(null as null | ProblemService);

    useEffect(() => {
        if (!speechService.current) { return; }

        problemService.current = createAutoSavedProblemService(
            createReviewProblemService(
                createFunnySpellingResponsesProblemService(
                    createSpellingProblemService({ speechService: speechService.current }),
                    speechService.current),
                {}),
            `ProblemsSpelling`);
    }, [speechService.current]);

    // Only web
    if (!hasStarted || !problemService.current) {
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

    return <EducationalGame_StarBlastSideways problemService={problemService.current} />;
};
