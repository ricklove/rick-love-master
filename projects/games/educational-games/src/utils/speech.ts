import { Platform } from '@ricklove/react-native-lite';

export const createSpeechService = (): {
  speak: (text: string, languange?: string) => void;
  getVoicesForLanguange: (languange: string) => { voice: SpeechSynthesisVoice; isSelected: boolean }[];
  setVoiceForLanguange: (languange: string, voice: SpeechSynthesisVoice) => void;
} => {
  if (Platform.OS !== `web`) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      speak: () => {},
      getVoicesForLanguange: () => [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      setVoiceForLanguange: () => {},
    };
  }

  const synth = window.speechSynthesis;

  const selectedVoices = {} as { [languange: string]: SpeechSynthesisVoice };

  const speak = (text: string, languange?: string) => {
    const voiceLang = selectedVoices[languange ?? `en`] ?? null;

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
    getVoicesForLanguange: (languange) => {
      const voices = synth.getVoices();
      console.log(`voices`, { voices });
      const v = voices
        .filter((x) => x.lang.startsWith(languange))
        .map((x) => ({
          voice: x,
          isSelected: selectedVoices[languange] === x,
        }));
      return v;
    },
    setVoiceForLanguange: (language, voice) => {
      selectedVoices[language] = voice;
    },
  };
};

export type SpeechService = ReturnType<typeof createSpeechService>;
