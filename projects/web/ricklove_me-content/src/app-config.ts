import { GameConfig } from '@ricklove/games-list';

export type AppConfig = GameConfig;
export const appConfig: AppConfig = {
  uploadApiUrl: `https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/upload-api`,
  websocketsApiUrl: `wss://p4w1a7ysk8.execute-api.us-east-1.amazonaws.com/prod`,
};
