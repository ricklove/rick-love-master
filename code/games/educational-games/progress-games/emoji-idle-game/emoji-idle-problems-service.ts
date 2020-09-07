import { ProblemService } from '../../problems/problems-service';
import { EmojiIdleService } from './emoji-idle-service';

export const createEmojiIdleProblemService = (problemSource: ProblemService, options?: {}): ProblemService => {
    const pet = EmojiIdleService.get();

    const service: ProblemService = {
        ...problemSource,
        recordAnswer: (problem, answer) => {
            if (answer.isCorrect) {
                pet.reward();
            }
            return problemSource.recordAnswer(problem, answer);
        },
    };
    return service;
};
