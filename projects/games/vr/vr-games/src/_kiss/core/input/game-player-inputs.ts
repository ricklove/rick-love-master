import { Quaternion, Vector3 } from 'three';
import { handJointNames } from './hand-joints';

export type GamePlayerInputs = {
  head: {
    position: Vector3;
    quaternion: Quaternion;
  };
  hands: {
    left: {
      handJoint: XRHandJoint;
      position: Vector3;
    }[];
    right: {
      handJoint: XRHandJoint;
      position: Vector3;
    }[];
  };
};

export const createGamePlayerInputs = (): GamePlayerInputs => ({
  head: {
    position: new Vector3(),
    quaternion: new Quaternion(),
  },
  hands: {
    left: handJointNames.map((x) => ({
      handJoint: x as XRHandJoint,
      position: new Vector3(),
    })),
    right: handJointNames.map((x) => ({
      handJoint: x as XRHandJoint,
      position: new Vector3(),
    })),
  },
});
