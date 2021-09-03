import { ProblemService } from '../../problems/problems-service';
import { PetService } from './pet-service';

export const createPetFeederProblemService = (problemSource: ProblemService, options?: {}): ProblemService => {
  const pet = PetService.get();

  const service: ProblemService = {
    ...problemSource,
    recordAnswer: (problem, answer) => {
      if (answer.isCorrect) {
        pet.feed();
      }
      return problemSource.recordAnswer(problem, answer);
    },
  };
  return service;
};
