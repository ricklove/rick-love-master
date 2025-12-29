import React, { ReactNode, useRef, useState } from 'react';
import {
  ConeTwistConstraintOpts,
  SpringOptns,
  Triplet,
  useConeTwistConstraint,
  useSpring,
  WorkerApi,
} from '@react-three/cannon';
import { CollideBeginEvent, CollideEndEvent, CollideEvent } from '@react-three/cannon';
import { Subject } from 'rxjs';
import { Object3D, Quaternion, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { cloneComponent, defineComponent, EntityBase, EntityWithTransform } from '../core';
import { EntityPhysicsView } from './physics-view';

export type EntityPhysicsConstraint = EntityWithTransform & {
  physicsConstraint: {
    uuid: string;
    api: WorkerApi;
    collideSubject: Subject<{
      entity: EntityPhysicsConstraint;
      other?: EntityPhysicsConstraint;
      sequence: `begin` | `end` | `continue`;
      event: CollideBeginEvent | CollideEndEvent | CollideEvent;
    }>;
    mass: number;
    entityA: EntityPhysicsView;
    entityB: EntityPhysicsView;
  };
  view: {
    debugColor?: number;
    Component: (props: { entity: EntityBase }) => JSX.Element;
    batchKey?: string;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
  };
};

export const EntityPhysicsConstraint = defineComponent<EntityPhysicsConstraint>()
  .with(`transform`, ({ startPosition }: { startPosition?: Triplet }) => ({
    position: startPosition ? new Vector3(...startPosition) : new Vector3(),
    quaternion: new Quaternion(),
  }))
  .with(
    `physicsConstraint`,
    ({ mass, entityA, entityB }: { mass?: number; entityA: EntityPhysicsView; entityB: EntityPhysicsView }) => ({
      mass: mass ?? 0,
      collideSubject: new Subject(),
      // Will be created by the component
      api: undefined as unknown as WorkerApi,
      uuid: ``,
      entityA,
      entityB,
    }),
  );

const WithReady = ({ entity, children }: { entity: EntityPhysicsConstraint; children: ReactNode }) => {
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const sub = entity.physicsConstraint.entityA.ready.subscribe(() => {
      entity.physicsConstraint.entityB.ready.subscribe(() => {
        // logger.log(`EntityPhysicsConstraintConeTwist ready`, { entity });
        setReady(true);
      });
    });
    return () => sub.unsubscribe();
  }, []);

  if (!ready) {
    return <></>;
  }
  return <>{children}</>;
};

// export const defineConstraint = <TConstraintOptions extends Record<string, unknown>, TName extends string>(
//   name: TName,
//   useConstraint: (bodyA: Ref<Object3D>, bodyB: Ref<Object3D>, options: TConstraintOptions) => void,
// ) => {
//   type EntityPhysicsConstraintTyped = EntityPhysicsConstraint & {
//     [name in TName]: {
//       options: TConstraintOptions;
//     };
//   };

//   const EntityPhysicsConstraintTyped = cloneComponent<EntityPhysicsConstraintTyped>()(EntityPhysicsConstraint)
//     .with(name, ({ options }: { options: TConstraintOptions }) => ({
//       options,
//     }))
//     .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
//       debugColor,
//       Component: (x) => (
//         <WithReady entity={x.entity as EntityPhysicsConstraintTyped}>
//           <EntityPhysicsConstraintViewConeTwistInner entity={x.entity as EntityPhysicsConstraintTyped} />
//         </WithReady>
//       ),
//     }));

//   const EntityPhysicsConstraintViewConeTwistInner = ({ entity }: { entity: EntityPhysicsConstraintTyped }) => {
//     const bodyARef = useRef({ uuid: entity.physicsConstraint.entityA.physics.api.uuid() } as Object3D);
//     const bodyBRef = useRef({ uuid: entity.physicsConstraint.entityB.physics.api.uuid() } as Object3D);
//     useConstraint(bodyARef, bodyBRef, entity[name].options);

//     return <></>;
//   };

//   return EntityPhysicsConstraintTyped;
// };

// Cone Twist
export type EntityPhysicsConstraintConeTwist = EntityPhysicsConstraint & {
  coneTwist: {
    options: ConeTwistConstraintOpts;
  };
};

export const EntityPhysicsConstraintConeTwist = cloneComponent<EntityPhysicsConstraintConeTwist>()(
  EntityPhysicsConstraint,
)
  .with(`coneTwist`, ({ options }: { options: ConeTwistConstraintOpts }) => ({
    options,
  }))
  .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
    debugColor,
    Component: (x) => (
      <WithReady entity={x.entity as EntityPhysicsConstraintConeTwist}>
        <EntityPhysicsConstraintViewConeTwistInner entity={x.entity as EntityPhysicsConstraintConeTwist} />
      </WithReady>
    ),
  }));

const EntityPhysicsConstraintViewConeTwistInner = ({ entity }: { entity: EntityPhysicsConstraintConeTwist }) => {
  const bodyARef = useRef({ uuid: entity.physicsConstraint.entityA.physics.api.uuid() } as Object3D);
  const bodyBRef = useRef({ uuid: entity.physicsConstraint.entityB.physics.api.uuid() } as Object3D);
  useConeTwistConstraint(bodyARef, bodyBRef, entity.coneTwist.options);

  return <></>;
};

// Spring
export type EntityPhysicsConstraintSpring = EntityPhysicsConstraint & {
  spring: {
    options: SpringOptns;
  };
};

export const EntityPhysicsConstraintSpring = cloneComponent<EntityPhysicsConstraintSpring>()(EntityPhysicsConstraint)
  .with(`spring`, ({ options }: { options: SpringOptns }) => ({
    options,
  }))
  .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
    debugColor,
    Component: (x) => (
      <WithReady entity={x.entity as EntityPhysicsConstraintSpring}>
        <EntityPhysicsConstraintViewSpringInner entity={x.entity as EntityPhysicsConstraintSpring} />
      </WithReady>
    ),
  }));

const EntityPhysicsConstraintViewSpringInner = ({ entity }: { entity: EntityPhysicsConstraintSpring }) => {
  const bodyARef = useRef({ uuid: entity.physicsConstraint.entityA.physics.api.uuid() } as Object3D);
  const bodyBRef = useRef({ uuid: entity.physicsConstraint.entityB.physics.api.uuid() } as Object3D);
  useSpring(bodyARef, bodyBRef, entity.spring.options);

  return <></>;
};
