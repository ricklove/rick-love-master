import { WorkerMessageFromWorker } from './message-type';

export const postMessageFromWorker = (message: WorkerMessageFromWorker) => {
  postMessage(message);
};
