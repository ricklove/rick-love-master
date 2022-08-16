import { randomItem } from '@ricklove/utils-core';
import { SpeechService } from '../../utils/speech';
import { ProblemService } from '../problems-service';

export const createFunnySpellingResponsesProblemService = (
  problemSource: ProblemService,
  speech: SpeechService,
): ProblemService => {
  const service: ProblemService = {
    ...problemSource,
    recordAnswer: (problem, answer) => {
      const speak = () => {
        // Responses
        if (!answer.isCorrect) {
          // Demotivation!
          const phrases = [
            `I've got a dog that spells better`,
            `That was horrible`,
            `What are you trying to do?`,
            `That is not a word`,
            `No, select the correct answer`,
            `Absolutely Incorrect`,
            `Completely Wrong`,
            `This is supposed to be English`,
            `What does the fox say?`,
          ];
          speech.speak(randomItem(phrases));
          speech.speak(problem.answers.find((x) => x.isCorrect)?.value ?? ``);
        } else {
          if (Math.random() > 0.1) {
            return;
          }

          const phrases = [
            `Good job! Thank you for the alien skulls.`,
            `Great! That's a nice pile of bones.`,
            // `Amazing! Keep getting better`,
          ];
          speech.speak(randomItem(phrases));
        }
      };
      speak();

      return problemSource.recordAnswer(problem, answer);
    },
  };
  return service;
};
