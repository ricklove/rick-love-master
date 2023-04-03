import { GamePlayerInputs } from '../input/game-player-inputs';

export type GameCore = {
  start: () => void;
  dispose: () => void;
  requestUpdateMessage: () => void;
  inputs: GamePlayerInputs;
};
