import React, { useEffect, useRef, useState } from 'react';
import { Platform, Text, View } from '@ricklove/react-native-lite';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { ProblemService } from '../problems/problems-service';
import { createFunnySpellingResponsesProblemService } from '../problems/spelling/spelling-funny-response-problem-services';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createSpeechService } from '../utils/speech';
import { VoiceChooser } from '../utils/voice-chooser';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EducationalGame_StarBlastSideways_Spelling = (props: {}) => {
  const speechService = useRef(createSpeechService());
  const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);
  const problemService = useRef(null as null | ProblemService);

  useEffect(() => {
    if (!speechService.current) {
      return;
    }

    problemService.current = createAutoSavedProblemService(
      createReviewProblemService(
        createFunnySpellingResponsesProblemService(
          createSpellingProblemService({ speechService: speechService.current }),
          speechService.current,
        ),
        {},
      ),
      `ProblemsSpelling`,
    );
  }, [speechService.current]);

  // Only web
  if (!hasStarted || !problemService.current) {
    const speak = () => {
      speechService.current.speak(`Start`);
      setHasStarted(true);
    };
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
