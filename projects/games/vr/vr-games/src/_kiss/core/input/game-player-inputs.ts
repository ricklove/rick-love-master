import { Quaternion, Vector3 } from 'three';
import { handJointNames } from './hand-joints';

export type GamePlayerInputs = {
  head: {
    position: Vector3;
    quaternion: Quaternion;
  };
  activeInputKind: { left: `controllerGrips` | `wrists`; right: `controllerGrips` | `wrists` };
  updateActiveInputKind: () => void;
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

export const createGamePlayerInputs = (): GamePlayerInputs => {
  const oldPositions = {
    wrists: {
      left: new Vector3(),
      right: new Vector3(),
    },
    controllerGrips: {
      left: new Vector3(),
      right: new Vector3(),
    },
    oldResult: {
      left: `controllerGrips` as `controllerGrips` | `wrists`,
      right: `controllerGrips` as `controllerGrips` | `wrists`,
    },
  };

  const getActiveInputKind = () => {
    const jointIndex = 0;
    const diffWristLeft = oldPositions.wrists.left.sub(inputs.hands.left[jointIndex].position).lengthSq();
    const diffWristRight = oldPositions.wrists.right.sub(inputs.hands.right[jointIndex].position).lengthSq();
    const diffControllerGripsLeft = oldPositions.controllerGrips.left
      .sub(inputs.controllerGrips.left.position)
      .lengthSq();
    const diffControllerGripsRight = oldPositions.controllerGrips.right
      .sub(inputs.controllerGrips.right.position)
      .lengthSq();

    const result = {
      left:
        diffControllerGripsLeft === diffWristLeft
          ? oldPositions.oldResult.left
          : diffControllerGripsLeft > diffWristLeft
          ? `controllerGrips`
          : `wrists`,
      right:
        diffControllerGripsRight === diffWristRight
          ? oldPositions.oldResult.right
          : diffControllerGripsRight > diffWristRight
          ? `controllerGrips`
          : `wrists`,
    } as const;

    oldPositions.wrists.left.copy(inputs.hands.left[jointIndex].position);
    oldPositions.wrists.right.copy(inputs.hands.right[jointIndex].position);
    oldPositions.controllerGrips.left.copy(inputs.controllerGrips.left.position);
    oldPositions.controllerGrips.right.copy(inputs.controllerGrips.right.position);
    oldPositions.oldResult = result;

    // wogger.log(`getActiveInputKind`, { ...result, oldPositions });
    return result;
  };

  const inputs: GamePlayerInputs = {
    head: {
      position: new Vector3(),
      quaternion: new Quaternion(),
    },
    activeInputKind: {
      left: `controllerGrips`,
      right: `controllerGrips`,
    },
    updateActiveInputKind: () => {
      const result = getActiveInputKind();
      inputs.activeInputKind.left = result.left;
      inputs.activeInputKind.right = result.right;
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
  };

  return inputs;
};
