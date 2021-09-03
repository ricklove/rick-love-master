import React, { useEffect, useRef, useState } from 'react';
import { createDoodleDrawingStorageService, DoodleConfig, DoodleDrawingStorageService } from '@ricklove/doodle-client';
import { ActivityIndicator, Platform, Text, View } from '@ricklove/react-native-lite';
import { useAsyncWorker } from '@ricklove/utils-react';
import { DoodleProblemService, EducationalGame_Doodle } from '../doodle-game';
import { createAutoSavedProblemService } from '../problems/problem-state-storage';
import { Problem } from '../problems/problems-service';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';
import { createProgressGameProblemService } from '../progress-games/progress-game';
import { createSpeechService } from '../utils/speech';
import { VoiceChooser } from '../utils/voice-chooser';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const EducationalGame_Doodle_Spelling = ({ config }: { config: DoodleConfig }) => {
  const speechService = useRef(createSpeechService());
  const [hasStarted, setHasStarted] = useState(Platform.OS !== `web`);

  const { loading, error, doWork } = useAsyncWorker();
  const drawingStorage = useRef(null as null | DoodleDrawingStorageService);
  const problemService = useRef(null as null | DoodleProblemService);
  useEffect(() => {
    doWork(async (stopIfObsolete) => {
      drawingStorage.current = await createDoodleDrawingStorageService(config);
      stopIfObsolete();

      const inner = createProgressGameProblemService(
        createAutoSavedProblemService(
          createSpellingProblemService({ speechService: speechService.current, sectionSize: 8 }),
          `ProblemsSpellingDoodle`,
        ),
      );

      let lastProblem = null as null | Problem;
      problemService.current = {
        getSections: inner.getSections,
        gotoSection: inner.gotoSection,
        getNextProblem: () => {
          if (lastProblem) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            inner.recordAnswer(lastProblem, lastProblem.answers.find((x) => x.isCorrect)!);
          }

          const p = inner.getNextProblem();
          if (!p.question) {
            return null;
          }
          lastProblem = p;

          return {
            prompt: p.answers.find((x) => x.isCorrect)?.value ?? ``,
            // hint: p.question,
            speakPrompt: p.onQuestion,
          };
        },
      };
    });
  }, []);

  // Only web
  if (!hasStarted) {
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

  if (loading || !drawingStorage.current || !problemService.current) {
    return (
      <>
        <ActivityIndicator size='large' color='#FFFF00' />
      </>
    );
  }

  return <EducationalGame_Doodle problemService={problemService.current} drawingStorage={drawingStorage.current} />;
};
