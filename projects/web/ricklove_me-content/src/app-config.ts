import { GameApiConfig } from '@ricklove/games-list';

export type AppApiConfig = GameApiConfig;
export const appApiConfig: AppApiConfig = {
  uploadApiUrl: `https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/upload-api`,
  websocketsApiUrl: `wss://p4w1a7ysk8.execute-api.us-east-1.amazonaws.com/prod`,
};
