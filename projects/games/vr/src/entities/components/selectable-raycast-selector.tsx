import React, { useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Mesh, Quaternion, Raycaster, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { calculateRotationMatrix } from '../../gestures/helpers';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';
import { EntitySelectable } from './selectable';

export type EntityRaycastSelector = EntityBase & {
  raycastSelector: {
    mode: `none` | `hover` | `down`;
    targets?: EntitySelectable[];
    activeTarget?: EntitySelectable;
    source?: {
      position: Vector3;
      direction: Vector3;
    };
  };
};

export const EntityRaycastSelector = defineComponent<EntityRaycastSelector>()
  .with(`raycastSelector`, () => {
    return {
      mode: `none`,
      raycaster: new Raycaster(),
    };
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
    changeSelectionMode: (entity: EntityRaycastSelector, mode: `none` | `hover` | `down`) => {
      const r = entity.raycastSelector;
      if (r.mode === mode) {
        return;
      }

      logger.log(`changeSelectionMode`, { mode });

      if (r.activeTarget) {
        if (mode === `down`) {
          EntitySelectable.downStart(r.activeTarget);
        }
        if (mode === `hover`) {
          EntitySelectable.hoverStart(r.activeTarget);
        }
        if (r.mode === `down`) {
          EntitySelectable.downEnd(r.activeTarget);
        }
        if (r.mode === `hover`) {
          EntitySelectable.hoverEnd(r.activeTarget);
        }
      }

      r.mode = mode;
    },
    changeTargets: (entity: EntityRaycastSelector, targets: EntitySelectable[]) => {
      const r = entity.raycastSelector;
      logger.log(`changeSelectionMode`, { targets: targets.length });
      r.targets = targets;
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
    const r = entity.raycastSelector;
    const w = workersRef.current;

    // logger.log(`r comp useFrame`, { s: !!r.source });

    if (!r.source) {
      return;
    }
    const s = r.source;

    // logger.log(`r comp`, { pos: formatVector(s.position), mode: r.mode });

    o.visible = r.mode !== `none`;
    o.position.copy(s.position);

    w.direction.copy(s.direction);
    calculateRotationMatrix(w);
    o.quaternion.copy(w.quaternion);

    if (!r.activeTarget) {
      return;
    }

    const a = r.activeTarget;
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
