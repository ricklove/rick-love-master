import { Platform } from 'react-native-lite';

export const createSpeechService = (): { speak: (text: string) => void } => {
    if (Platform.OS !== `web`) { return { speak: () => { } }; }

    const synth = window.speechSynthesis;
    // const voices = synth.getVoices();
    // const voice = voices[0];

    const speak = (text: string) => {
        try {
            const u = new SpeechSynthesisUtterance(text);
            // u.voice = voice;
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
