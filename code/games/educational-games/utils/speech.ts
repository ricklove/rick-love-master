import { Platform } from 'react-native-lite';

export const createSpeechService = (): { speak: (text: string, languange?: 'en' | 'es') => void } => {
    if (Platform.OS !== `web`) { return { speak: () => { } }; }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    console.log(`voices`, { voices });

    const speak = (text: string, languange?: 'en' | 'es') => {
        const voiceLang = voices.filter(x => !languange || x.lang.startsWith(languange))[0];

        try {
            const u = new SpeechSynthesisUtterance(text);
            u.voice = voiceLang;
            synth.speak(u);
        } catch {
            // Ignore
        }
    };

    return {
        speak,
    };
};

export type SpeechService = ReturnType<typeof createSpeechService>;
