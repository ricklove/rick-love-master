import React, { useRef, useState } from 'react';
import { ConeTwistConstraintOpts, Triplet, useConeTwistConstraint, WorkerApi } from '@react-three/cannon';
import { CollideBeginEvent, CollideEndEvent, CollideEvent } from '@react-three/cannon';
import { Subject } from 'rxjs';
import { Object3D, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { cloneComponent, defineComponent, EntityBase } from '../core';
import { EntityPhysicsView } from './physics-view';

export type EntityPhysicsConstraint = EntityBase & {
  transform: {
    position: Vector3;
  };
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
  }))
  .with(`physicsConstraint`, ({ mass }: { mass?: number }) => ({
    mass: mass ?? 0,
    collideSubject: new Subject(),
    // Will be created by the component
    api: undefined as unknown as WorkerApi,
    uuid: ``,
  }));

export type EntityPhysicsConstraintConeTwist = EntityPhysicsConstraint & {
  coneTwist: {
    entityA: EntityPhysicsView;
    entityB: EntityPhysicsView;
    options: ConeTwistConstraintOpts;
  };
};

export const EntityPhysicsConstraintConeTwist = cloneComponent<EntityPhysicsConstraintConeTwist>()(
  EntityPhysicsConstraint,
)
  .with(
    `coneTwist`,
    ({
      entityA,
      entityB,
      options,
    }: {
      entityA: EntityPhysicsView;
      entityB: EntityPhysicsView;
      options: ConeTwistConstraintOpts;
    }) => ({
      entityA,
      entityB,
      options,
    }),
  )
  .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
    debugColor,
    Component: (x) => <EntityPhysicsConstraintViewConeTwist entity={x.entity as EntityPhysicsConstraintConeTwist} />,
  }));

const EntityPhysicsConstraintViewConeTwist = ({ entity }: { entity: EntityPhysicsConstraintConeTwist }) => {
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const sub = entity.coneTwist.entityA.ready.subscribe((r) => {
      if (!r) {
        return;
      }
      setReady(true);
    });
    return () => sub.unsubscribe();
  }, []);

  if (!ready) {
    return <></>;
  }
  return <EntityPhysicsConstraintViewConeTwistInner entity={entity} />;
};

const EntityPhysicsConstraintViewConeTwistInner = ({ entity }: { entity: EntityPhysicsConstraintConeTwist }) => {
  const bodyARef = useRef({ uuid: entity.coneTwist.entityA.physics.api.uuid() } as Object3D);
  const bodyBRef = useRef({ uuid: entity.coneTwist.entityB.physics.api.uuid() } as Object3D);
  useConeTwistConstraint(bodyARef, bodyBRef, entity.coneTwist.options);

  // logger.log(`EntityPhysicsConstraintViewConeTwistInner`, {
  //   bodyARef: bodyARef.current.uuid,
  //   bodyBRef: bodyBRef.current.uuid,
  // });
  return <></>;
};
