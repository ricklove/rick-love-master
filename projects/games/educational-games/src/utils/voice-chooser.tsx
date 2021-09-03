import React, { useState, useEffect } from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from '@ricklove/react-native-lite';
import { SpeechService } from './speech';

export const VoiceChooser = ({ languange, speechService }: { languange: string; speechService: SpeechService }) => {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [renderId, setRenderId] = useState(0);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    refresh();
  }, []);

  const selectVoice = (voice: SpeechSynthesisVoice) => {
    speechService.setVoiceForLanguange(languange, voice);
    setRenderId((s) => s + 1);
    speechService.speak(voice.name, languange);
  };

  return (
    <View>
      <TouchableOpacity onPress={refresh}>
        <Text style={{ fontSize: 24 }}>{`Voice for ${languange}`}</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size='small' color='red' />}
      {!loading && (
        <>
          {speechService.getVoicesForLanguange(languange).map((x) => (
            <TouchableOpacity
              key={x.voice.name}
              onPress={() => {
                selectVoice(x.voice);
              }}
            >
              <View>
                <Text style={{ margin: 4, fontSize: 14, whiteSpace: `normal` }}>{`${x.isSelected ? `✅` : `🔲`} ${
                  x.voice.lang
                } - ${x.voice.name} - ${x.voice.localService ? `local` : `web`}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};
