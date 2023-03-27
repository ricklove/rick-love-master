import { EventQueue, RigidBody } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';

export type GameWorkerCreateEntityArgs<TType extends string, TUserData extends Record<string, unknown>> = {
  type: TType;
  shape: `box` | `sphere`;
  position: Vector3;
  active?: boolean;
  kind?: `fixed` | `dynamic` | `kinematicPositionBased` | `kinematicVelocityBased`;
  scale?: Vector3;
  radius?: number;
  quaternion?: Quaternion;

  collisionEvents?: boolean;
  restitution?: number;
  sensor?: boolean;
  gravityScale?: number;

  userData?: TUserData;
};
export type GameWorkerEntity<TType extends string, TUserData extends Record<string, unknown>> = {
  id: number;
  type: TType;
  shape: `box` | `sphere`;
  args: GameWorkerCreateEntityArgs<TType, TUserData>;
  userData: TUserData;
  active: boolean;
  physics: {
    rigidBody: RigidBody;
  };
};
export type GameWorkerEngine = {
  start: (gameEngine: GameEngine) => void;
  dispose: () => void;
  updateMessageRequested: boolean;
  createEntity: <TType extends string, TUserData extends Record<string, unknown>>(
    args: GameWorkerCreateEntityArgs<TType, TUserData>,
  ) => GameWorkerEntity<TType, TUserData>;
  setGravity: (gravity: Vector3) => void;
  inputs: {
    handJoints: { position: Vector3 }[];
  };
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
