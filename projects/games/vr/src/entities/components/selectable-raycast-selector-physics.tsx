import React, { useMemo, useRef, useState } from 'react';
import { RayhitEvent, Triplet, useRaycastClosest } from '@react-three/cannon';
import { extend, Object3DNode, useFrame } from '@react-three/fiber';
import { BufferGeometry, Line as ThreeLine, Mesh, Vector3 } from 'three';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';
import { EntityRaycastSelector } from './selectable-raycast-selector';

export type EntityRaycastSelectorPhysics = EntityRaycastSelector & {
  raycastSelectorPhysics: {
    // raycaster: Raycaster;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityRaycastSelectorPhysics = defineComponent<EntityRaycastSelectorPhysics>()
  .with(`raycastSelectorPhysics`, () => {
    return {
      //raycaster: new Raycaster(),
    };
  })
  .with(`view`, () => ({
    Component: (x) => <EntityRaycastSelectorPhysicsComponent entity={x.entity as EntityRaycastSelectorPhysics} />,
  }));

export const EntityRaycastSelectorPhysicsComponent = ({
  entity,
  color,
  length,
}: {
  entity: EntityRaycastSelectorPhysics;
  color?: number;
  length?: number;
}) => {
  const [rayProps, setRayProps] = useState({
    visible: false,
    from: [0, 0, 0] as Triplet,
    to: [0, 0, 0] as Triplet,
    onHit: (e: RayhitEvent) => {
      logger.log(`r hit`, { e: e.distance });

      const t = entity.raycastSelector.targets?.find((t) => t.selectable.target === e.body);
      if (!t) {
        return;
      }
      logger.log(`r hit`, { name: t.name, key: t.key });
    },
  });
  const refTarget = useRef<Mesh>(null);
  const workersRef = useRef({
    from: new Vector3(),
    to: new Vector3(),
    a: new Vector3(),
  });

  // logger.log(`EntityRaycastSelectorPhysicsComponent RENDER`, {});

  useFrame(() => {
    if (!refTarget.current) {
      return;
    }
    const r = entity.raycastSelector;
    const w = workersRef.current;

    if (!r.source) {
      return;
    }
    const s = r.source;
    // logger.log(`r comp phy`, { pos: formatVector(s.position), mode: r.mode });

    w.from.copy(s.position);
    w.to.copy(s.position).add(w.a.copy(s.direction).multiplyScalar(100));

    setRayProps((s) => {
      const visible = r.mode !== `none`;
      if (!visible && !s.visible) {
        return s;
      }
      return {
        ...s,
        visible,
        from:
          w.a
            .set(...s.from)
            .sub(w.from)
            .lengthSq() > 0.001
            ? w.from.toArray()
            : s.from,
        to:
          w.a
            .set(...s.to)
            .sub(w.to)
            .lengthSq() > 0.01
            ? w.to.toArray()
            : s.to,
      };
    });

    if (!r.activeTarget) {
      return;
    }

    const a = r.activeTarget;
    const t = refTarget.current;
    t.position.copy(a.transform.position);
  });

  return (
    <>
      <RayClosest {...rayProps} />
      <mesh ref={refTarget}>
        <sphereGeometry args={[1]} />
        <meshBasicMaterial color={`#00ff00`} transparent={true} opacity={0.5} />
      </mesh>
    </>
  );
};

extend({ ThreeLine });

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface IntrinsicElements {
      threeLine: Object3DNode<ThreeLine, typeof ThreeLine>;
    }
  }
}

const RayClosest = ({
  visible,
  from,
  to,
  onHit,
}: {
  visible: boolean;
  from: Triplet;
  to: Triplet;
  onHit: (e: RayhitEvent) => void;
}) => {
  useRaycastClosest({ from, to }, onHit);

  const workersRef = useRef([new Vector3(), new Vector3()]);

  const geometry = useMemo(() => {
    const w = workersRef.current;
    w[0].set(...from);
    w[1].set(...to);
    return new BufferGeometry().setFromPoints(w);
  }, [from, to]);

  // logger.log(`RayClosest RENDER`, {
  //   from: formatVector(workersRef.current[0]),
  //   to: formatVector(workersRef.current[0]),
  // });

  return (
    <threeLine geometry={geometry}>
      <lineBasicMaterial color={0xff00ff} transparent={true} opacity={visible ? 0.5 : 0.1} linewidth={10} />
    </threeLine>
  );
};
