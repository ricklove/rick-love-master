import { Quaternion, Vector3 } from 'three';
import { handJointNames } from './hand-joints';

export type GamePlayerInputs = {
  head: {
    position: Vector3;
    quaternion: Quaternion;
  };
  controllerGrips: {
    left: {
      position: Vector3;
      quaternion: Quaternion;
    };
    right: {
      position: Vector3;
      quaternion: Quaternion;
    };
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
  mouse: {
    position: Vector3;
    direction: Vector3;
    time: number;
    buttons: number;
    wheelDeltaX: number;
    wheelDeltaY: number;
  };
};

export const createGamePlayerInputs = (): GamePlayerInputs => ({
  head: {
    position: new Vector3(),
    quaternion: new Quaternion(),
  },
  controllerGrips: {
    left: {
      position: new Vector3(),
      quaternion: new Quaternion(),
    },
    right: {
      position: new Vector3(),
      quaternion: new Quaternion(),
    },
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
  mouse: {
    position: new Vector3(),
    direction: new Vector3(),
    time: 0,
    buttons: 0,
    wheelDeltaX: 0,
    wheelDeltaY: 0,
  },
});
