/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from 'react';
import { Text, View, Platform, ActivityIndicator, TouchableOpacity } from 'react-native-lite';
import { createSpeechService, SpeechService } from '../utils/speech';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpanishProblemService } from '../problems/definition-spanish';

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

const VoiceChooser = ({ languange, speechService }: { languange: string, speechService: SpeechService }) => {
    const [loading, setLoading] = useState(true);
    const [renderId, setRenderId] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    });

    const selectVoice = (voice: SpeechSynthesisVoice) => {
        speechService.setVoiceForLanguange(languange, voice);
        setRenderId(s => s + 1);
        speechService.speak(voice.name, languange);
    };

    return (
        <View>
            <Text style={{ fontSize: 24 }}>{`Voice for ${languange}`}</Text>
            {loading && <ActivityIndicator size='small' color='red' />}
            {!loading && (
                <>
                    {speechService.getVoicesForLanguange(languange).map(x => (
                        <TouchableOpacity onPress={() => { selectVoice(x.voice); }}>
                            <View>
                                <Text style={{ margin: 4, fontSize: 14, whiteSpace: `normal` }} >{`${x.isSelected ? `✅` : `🔲`} ${x.voice.lang} - ${x.voice.name} - ${x.voice.localService ? `local` : `web`}`}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </>
            )}
        </View>
    );
};
