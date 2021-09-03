import React, { useRef, useState } from 'react';
import { Platform, Text, View } from '@ricklove/react-native-lite';
import { createSpanishProblemService } from '../problems/definition-spanish';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createSpeechService } from '../utils/speech';
import { VoiceChooser } from '../utils/voice-chooser';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EducationalGame_StarBlastSideways_Spanish = (props: {}) => {
  const speechService = useRef(createSpeechService());
  const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);

  // Only web
  if (!hasStarted) {
    const speak = () => {
      speechService.current.speak(`Start`);
      setHasStarted(true);
    };
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

  return (
    <EducationalGame_StarBlastSideways
      problemService={createAutoSavedProblemService(
        createReviewProblemService(createSpanishProblemService({ speechService: speechService.current }), {}),
        `ProblemsSpanish`,
      )}
    />
  );
};
