import { DoodleConfig } from '@ricklove/doodle-client';
import { educationalGamesList, educationalGameUtils } from '@ricklove/educational-games';
import { vrGamesList } from '@ricklove/vr-games';

export type GameConfig = DoodleConfig;
export type GameComponent = (props: { config: GameConfig }) => JSX.Element;
export const gamesList: { name: string; load: () => Promise<GameComponent> }[] = [
  ...educationalGamesList,
  { name: `doodle-browser`, load: async () => (await import(`@ricklove/doodle-client`)).DoodleBrowser },
  { name: `doodle-party`, load: async () => (await import(`@ricklove/doodle-client`)).DoodlePartyView },
  ...vrGamesList,
];

export const gameUtils = {
  ...educationalGameUtils,
};
