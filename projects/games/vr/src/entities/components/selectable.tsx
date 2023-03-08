import React, { useRef } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Matrix4, Mesh, Object3D, Quaternion, Raycaster, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { createSubscribable, Subscribable } from '@ricklove/utils-core';
import { calculateRotationMatrix } from '../../gestures/helpers';
import { formatVector } from '../../utils/formatters';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';

export type EntitySelectable = EntityBase & {
  selectable: {
    state: `inactive` | `hover` | `down`;
    hoverCount: number;
    downCount: number;
    observeStateChange: Subscribable<{
      entity: EntitySelectable;
      event: `hoverStart` | `hoverEnd` | `downStart` | `downEnd`;
    }>;
    target?: Object3D;
    targetInstanceId?: number;
    radius?: number;
  };
  transform: {
    position: Vector3;
  };
};

export const EntitySelectable = defineComponent<EntitySelectable>()
  .with(`selectable`, ({ target, radius }: { target?: Object3D; radius?: number }) => {
    return {
      state: `inactive`,
      hoverCount: 0,
      downCount: 0,
      observeStateChange: createSubscribable(),
      target,
      radius,
    };
  })
  .attach({
    hoverStart: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverStart`, { name: entity.name, key: entity.key, s: s.state });

      s.hoverCount++;
      if (s.hoverCount === 1 && s.state === `inactive`) {
        s.state = `hover`;
        s.observeStateChange.onStateChange({ entity, event: `hoverStart` });
      }
    },
    hoverEnd: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverEnd`, { name: entity.name, key: entity.key, s: s.state });

      s.hoverCount--;
      if (s.hoverCount === 0 && s.state === `hover`) {
        s.state = `inactive`;
        s.observeStateChange.onStateChange({ entity, event: `hoverEnd` });
      }
    },
    downStart: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downStart`, { name: entity.name, key: entity.key, s: s.state });

      s.downCount++;
      if (s.downCount === 1 && s.state !== `down`) {
        s.state = `down`;
        s.observeStateChange.onStateChange({ entity, event: `downStart` });
      }
    },
    downEnd: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downEnd`, { name: entity.name, key: entity.key, s: s.state });

      s.downCount--;
      if (s.downCount === 0) {
        if (s.hoverCount) {
          s.state = `hover`;
        } else {
          s.state = `inactive`;
        }
        s.observeStateChange.onStateChange({ entity, event: `downEnd` });
      }
    },
  });

export type EntityRaycastSelector = EntityBase & {
  raycastSelector: {
    mode: `none` | `hover` | `down`;
    raycaster: Raycaster;
    activeTarget?: EntitySelectable;
    source?: {
      position: Vector3;
      direction: Vector3;
    };
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityRaycastSelector = defineComponent<EntityRaycastSelector>()
  .with(`raycastSelector`, () => {
    return {
      mode: `none`,
      raycaster: new Raycaster(),
    };
  })
  .with(`view`, () => ({
    Component: (x) => <EntityRaycastSelectorComponent entity={x.entity as EntityRaycastSelector} />,
  }))
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
    raycast: (entity: EntityRaycastSelector, selectables: EntitySelectable[]) => {
      const r = entity.raycastSelector;
      if (!r.source) {
        return;
      }
      const targets = [...new Set(selectables.filter((s) => s.selectable.target).map((s) => s.selectable.target!))];
      r.raycaster.set(r.source.position, r.source.direction);
      const intersections = r.raycaster.intersectObjects(targets);
      const intersection = intersections[0];

      if (intersection) {
        logger.log(`raycast - intersection`, {
          id: intersection?.instanceId,
          intersection: intersection && formatVector(intersection.point),
          position: formatVector(r.source.position),
          direction: formatVector(r.source.direction),
          targets: targets.length,
        });
      }

      const s = selectables.find(
        (s) =>
          s.selectable.target === intersection?.object && s.selectable.targetInstanceId === intersection.instanceId,
      );
      if (s === r.activeTarget) {
        return;
      }

      if (r.activeTarget) {
        (r.mode === `hover` ? EntitySelectable.hoverEnd : EntitySelectable.downEnd)(r.activeTarget);
      }

      r.activeTarget = s;
      if (!r.activeTarget) {
        return;
      }

      (r.mode === `hover` ? EntitySelectable.hoverStart : EntitySelectable.downStart)(r.activeTarget);
    },
  });

export const EntityRaycastSelectorComponent = ({
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

  logger.log(`EntityRaycastSelectorComponent RENDER`, {});

  useFrame(() => {
    logger.log(`r comp useFrame`, { r: !refLine.current || !refTarget.current });

    if (!refLine.current || !refTarget.current) {
      return;
    }
    const o = refLine.current;
    const r = entity.raycastSelector;
    const w = workersRef.current;

    logger.log(`r comp useFrame`, { s: !!r.source });

    if (!r.source) {
      return;
    }
    const s = r.source;

    logger.log(`r comp`, { pos: formatVector(s.position), mode: r.mode });

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
