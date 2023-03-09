import React, { useRef, useState } from 'react';
import { Triplet, useBox } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Mesh, Quaternion, Vector3 } from 'three';
import { calculateRotationMatrix } from '../../gestures/helpers';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';
import { SelectorMode } from './selectable';
import { EntityRaycastSelector } from './selectable-raycast-selector';

export type EntityRaycastSelectorCollider = EntityRaycastSelector & {
  raycastSelectorCollider: {
    // raycaster: Raycaster;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityRaycastSelectorCollider = defineComponent<EntityRaycastSelectorCollider>()
  .with(`raycastSelectorCollider`, () => {
    return {
      //raycaster: new Raycaster(),
    };
  })
  .with(`view`, () => ({
    Component: (x) => <EntityRaycastSelectorColliderComponent entity={x.entity as EntityRaycastSelectorCollider} />,
  }));

export const EntityRaycastSelectorColliderComponent = ({
  entity,
  color,
  length,
}: {
  entity: EntityRaycastSelectorCollider;
  color?: number;
  length?: number;
}) => {
  const [mode, setMode] = useState(`none` as SelectorMode);
  const size = [0.1, 0.1, 100] as Triplet;
  const [refTrigger, apiTrigger] = useBox(
    () => ({
      args: size,
      type: `Static`,
      isTrigger: true,
      onCollide: (e) => {
        logger.log(`r hit`, { target: e.target.userData, body: e.body.userData, op: e.op });

        const t = entity.selector.targets?.find((t) => t.selectable.target === e.body);
        if (!t) {
          return;
        }
        logger.log(`r hit`, { name: t.name, key: t.key });
      },
      position: [0, 0, 0],
      userData: {
        key: entity.key,
        name: entity.name,
      },
    }),
    useRef<Mesh>(null),
  );

  const refTarget = useRef<Mesh>(null);
  const workersRef = useRef({
    from: new Vector3(),
    toMid: new Vector3(),

    a: new Vector3(),

    direction: new Vector3(),
    rotationMatrix: new Matrix4(),
    quaternion: new Quaternion(),
  });

  // logger.log(`EntityRaycastSelectorColliderComponent RENDER`, {});

  useFrame(() => {
    if (!refTarget.current) {
      return;
    }
    const r = entity.selector;
    const { source } = entity.raycastSelector;
    const w = workersRef.current;

    if (!source) {
      return;
    }
    const s = source;
    // logger.log(`r comp phy`, { pos: formatVector(s.position), mode: r.mode });

    w.from.copy(s.position);
    w.toMid.copy(s.position).add(w.a.copy(s.direction).multiplyScalar(50));

    w.direction.copy(s.direction);
    calculateRotationMatrix(w);

    apiTrigger.position.copy(w.toMid);
    apiTrigger.quaternion.copy(w.quaternion);
    apiTrigger.userData.set({
      key: entity.key,
      name: entity.name,
      mode: entity.selector.mode,
    });

    setMode(entity.selector.mode);

    if (!r.activeTarget) {
      return;
    }

    const a = r.activeTarget;
    const t = refTarget.current;
    t.position.copy(a.transform.position);
  });

  return (
    <>
      <mesh ref={refTrigger}>
        <boxBufferGeometry args={size} />
        <meshStandardMaterial wireframe color={mode === `down` ? 0xff0000 : mode === `hover` ? 0xff00ff : 0x0000ff} />
      </mesh>
      <mesh ref={refTarget}>
        <sphereGeometry args={[5]} />
        <meshBasicMaterial color={`#00ff00`} transparent={true} opacity={0.15} />
      </mesh>
    </>
  );
};
