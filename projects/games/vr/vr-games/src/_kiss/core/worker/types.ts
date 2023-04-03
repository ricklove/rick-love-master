import { Quaternion, Vector3 } from 'three';

export type GameCore = {
  start: () => void;
  dispose: () => void;
  requestUpdateMessage: () => void;
  inputs: {
    head: { position: Vector3; quaternion: Quaternion };
    handJoints: { position: Vector3 }[];
  };
};
