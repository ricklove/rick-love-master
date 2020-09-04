/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Platform, ActivityIndicator, TouchableOpacity } from 'react-native-lite';
import { createSpeechService, SpeechService } from '../utils/speech';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpanishProblemService } from '../problems/definition-spanish';
import { VoiceChooser } from './voice-chooser';

export const EducationalGame_StarBlastSideways_Spanish = (props: {}) => {
    const speechService = useRef(createSpeechService());
    const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);

    // Only web
    if (!hasStarted) {
        const speak = () => { speechService.current.speak(`Start`); setHasStarted(true); };
        return (
            <View>
                <VoiceChooser languange='en' speechService={speechService.current} />
                <VoiceChooser languange='es' speechService={speechService.current} />
                <div onClick={() => speak()}>
                    <View style={{ height: 300, alignSelf: `center`, alignItems: `center`, justifyContent: `center` }}>
                        <Text style={{ fontSize: 36 }}>Start</Text>
                    </View>
                </div>
            </View>
        );
    }

    return <EducationalGame_StarBlastSideways problemService={createReviewProblemService(createSpanishProblemService({ speechService: speechService.current }), {})} />;
};
