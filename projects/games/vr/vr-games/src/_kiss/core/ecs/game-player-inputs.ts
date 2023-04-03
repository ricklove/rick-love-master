import { Quaternion, Vector3 } from 'three';
import { handJointNames } from '../input/hand-joints';

export type GamePlayerInputs = {
  head: {
    position: Vector3;
    quaternion: Quaternion;
  };
  handJoints: {
    handJoint: XRHandJoint;
    position: Vector3;
  }[];
};

export const createGamePlayerInputs = (): GamePlayerInputs => ({
  head: {
    position: new Vector3(),
    quaternion: new Quaternion(),
  },
  handJoints: handJointNames.map((x) => ({
    handJoint: x as XRHandJoint,
    position: new Vector3(),
  })),
});
