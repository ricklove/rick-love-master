import { Platform } from 'react-native-lite';

export const createSpeechService = (): { speak: (text: string) => void } => {
    if (Platform.OS !== `web`) { return { speak: () => { } }; }

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const voice = voices[0];

    const speak = (text: string) => {
        const utterThis = new SpeechSynthesisUtterance(text);
        utterThis.voice = voice;
        synth.speak(utterThis);
    };

    return {
        speak,
    };
};
