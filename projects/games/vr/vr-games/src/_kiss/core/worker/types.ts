import { EventQueue, RigidBody } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';

type GameWorkerCreateEntityArgs_Common = {
  position: Vector3;
  quaternion?: Quaternion;
  active?: boolean;
  color?: number;
};

type GameWorkerCreateEntityArgs_CommonPhysical = {
  physics?: boolean;
  kind?: `fixed` | `dynamic` | `kinematicPositionBased` | `kinematicVelocityBased`;
  collisionEvents?: boolean;
  restitution?: number;
  sensor?: boolean;
  gravityScale?: number;
};

type GameWorkerCreateEntityArgs_Sphere = {
  shape: `sphere`;
  radius: number;
};

type GameWorkerCreateEntityArgs_Box = {
  shape: `box`;
  scale: Vector3;
};

type GameWorkerCreateEntityArgs_Physical = GameWorkerCreateEntityArgs_CommonPhysical &
  (GameWorkerCreateEntityArgs_Sphere | GameWorkerCreateEntityArgs_Box);

type GameWorkerCreateEntityArgs_Text = {
  shape: `text`;
  fontSize: number;
};

type GameWorkerCreateEntityArgs_NonPhysical = GameWorkerCreateEntityArgs_Text;

export type GameWorkerCreateEntityArgs = GameWorkerCreateEntityArgs_Common &
  (GameWorkerCreateEntityArgs_Physical | GameWorkerCreateEntityArgs_NonPhysical);

type PhysicsFields = {
  physics: {
    rigidBody: RigidBody;
  };
};
type NonPhysicsFields = {
  physics: undefined;
  graphics: {
    position: Vector3;
    quaternion: Vector3;
  };
};
export type PhysicsFieldsObj<
  TShape extends string,
  TPhysics extends true | false,
> = TShape extends GameWorkerCreateEntityArgs_Physical[`shape`]
  ? TPhysics extends undefined | true
    ? PhysicsFields
    : NonPhysicsFields
  : NonPhysicsFields;

export type GameWorkerEntity<
  TArgs extends GameWorkerCreateEntityArgs,
  TShape extends string,
  TPhysics extends true | false,
  TType extends string,
  TUserData extends Record<string, unknown>,
> = {
  id: number;
  type: TType;
  shape: TShape;
  args: TArgs;
  userData: TUserData;
  active: boolean;
} & PhysicsFieldsObj<TShape, TPhysics>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export type BooleanDefaultTrueOfOptionalField<T, K extends string> = K extends keyof T
  ? T[K] extends false
    ? false
    : true
  : true;

export type GameWorkerEngine = {
  start: (gameEngine: GameEngine) => void;
  dispose: () => void;
  updateMessageRequested: boolean;
  createEntity: <
    TArgs extends GameWorkerCreateEntityArgs,
    TType extends string,
    TUserData extends Record<string, unknown>,
  >(
    args: TArgs & { type: TType; userData?: TUserData },
  ) => GameWorkerEntity<TArgs, TArgs[`shape`], BooleanDefaultTrueOfOptionalField<TArgs, `physics`>, TType, TUserData>;
  setGravity: (gravity: Vector3) => void;
  inputs: {
    head: { position: Vector3; quaternion: Quaternion };
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
  head: {
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
