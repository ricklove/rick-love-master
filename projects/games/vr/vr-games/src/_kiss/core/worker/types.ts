import { EventQueue, RigidBody } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';

export type GameWorkerEngine = {
  start: () => void;
  dispose: () => void;
  updateMessageRequested: boolean;
  createEntity: <TType extends string, TUserData extends Record<string, unknown>>(args: {
    type: TType;
    shape: `box` | `sphere`;
    position: Vector3;
    active?: boolean;
    kind?: `fixed` | `dynamic` | `kinematicPositionBased` | `kinematicVelocityBased`;
    scale?: Vector3;
    radius?: number;
    quaternion?: Quaternion;
    collisionEvents?: boolean;
    userData?: TUserData;
  }) => {
    type: TType;
    shape: `box` | `sphere`;
    userData: TUserData;
    active: boolean;
    id: number;
    rigidBody: RigidBody;

    engine: {
      id: number;
      position: Vector3;
      quaternion: Quaternion;
      scale: Vector3;
      hasSentAddMessage: boolean;
      hasMoved: boolean;
    };
  };
  handJoints: { position: Vector3 }[];
};

export type GameEngine = {
  update: (deltaTimeSec: number, player: GameEnginePlayer, eventQueue: EventQueue) => void;
};

export type GameEnginePlayer = {
  origin: {
    position: Vector3;
  };
  camera: {
    position: Vector3;
    quaternion: Quaternion;
  };
  hands: {
    left: {
      side: `left`;
      position: Vector3;
      quaternion: Quaternion;
    };
    right: {
      side: `right`;
      position: Vector3;
      quaternion: Quaternion;
    };
  };
};