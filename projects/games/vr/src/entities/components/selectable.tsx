import { Object3D, Vector3 } from 'three';
import { createSubscribable, Subscribable } from '@ricklove/utils-core';
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
    targetPhysicsObject?: unknown;
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
