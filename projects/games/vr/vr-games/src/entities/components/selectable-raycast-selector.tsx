import React, { useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Mesh, Quaternion, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { calculateRotationMatrix } from '../../gestures/helpers';
import { defineComponent } from '../core';
import { EntitySelector } from './selectable';

export type EntityRaycastSelector = EntitySelector & {
  raycastSelector: {
    source?: {
      position: Vector3;
      direction: Vector3;
    };
  };
};

export const EntityRaycastSelector = defineComponent<EntityRaycastSelector>()
  .with(`raycastSelector`, () => {
    return {};
  })
  .attach({
    changeSource: (
      entity: EntityRaycastSelector,
      source: {
        position: Vector3;
        direction: Vector3;
      },
    ) => {
      const r = entity.raycastSelector;
      r.source = source;

      // logger.log(`changeSource`, { pos: formatVector(source.position) });
    },
  });

export const EntityRaycastSelectorDebugComponent = ({
  entity,
  color,
  length,
}: {
  entity: EntityRaycastSelector;
  color?: number;
  length?: number;
}) => {
  const refLine = useRef<Line2>(null);
  const refTarget = useRef<Mesh>(null);
  const workersRef = useRef({
    direction: new Vector3(),
    rotationMatrix: new Matrix4(),
    quaternion: new Quaternion(),
  });

  useFrame(() => {
    // logger.log(`r comp useFrame`, { r: !refLine.current || !refTarget.current });

    if (!refLine.current || !refTarget.current) {
      return;
    }
    const o = refLine.current;
    const r = entity.selector;
    const { source } = entity.raycastSelector;
    const w = workersRef.current;

    // logger.log(`r comp useFrame`, { s: !!r.source });

    if (!source) {
      return;
    }
    const s = source;

    // logger.log(`r comp`, { pos: formatVector(s.position), mode: r.mode });

    o.visible = r.mode !== `none`;
    o.position.copy(s.position);

    w.direction.copy(s.direction);
    calculateRotationMatrix(w);
    o.quaternion.copy(w.quaternion);

    if (!Object.keys(r.selectables).length) {
      return;
    }

    const a = Object.values(r.selectables)[0].selectable;
    const t = refTarget.current;
    t.position.copy(a.transform.position);
  });

  return (
    <>
      <Line
        ref={refLine}
        lineWidth={2}
        points={[
          [0, 0, 0],
          [0, 0, -(length ?? 100)],
        ]}
        color={color ?? 0x88ff33}
      />
      <mesh ref={refTarget}>
        <sphereGeometry args={[1]} />
        <meshBasicMaterial color={`#00ff00`} transparent={true} opacity={0.5} />
      </mesh>
    </>
  );
};
