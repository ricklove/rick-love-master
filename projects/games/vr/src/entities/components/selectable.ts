import { Object3D, Raycaster, Vector3 } from 'three';
import { createSubscribable, Subscribable } from '@ricklove/utils-core';
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

      //   if (intersection) {
      logger.log(`raycast - intersection`, {
        id: intersection?.instanceId,
        intersection: intersection && formatVector(intersection.point),
        position: formatVector(r.source.position),
        direction: formatVector(r.source.direction),
        targets: targets.length,
      });
      //   }

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
