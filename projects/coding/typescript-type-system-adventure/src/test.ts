import { gameStart } from './game-type-system';

const play = () => {
  return gameStart.command(`look`).execute;
};
