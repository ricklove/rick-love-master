import { WorkerMessageFromWorker } from './message-type';

export const postMessageTyped = (message: WorkerMessageFromWorker) => {
  postMessage(message);
};
