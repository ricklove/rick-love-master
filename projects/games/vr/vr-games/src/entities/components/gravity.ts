import { defineComponent, EntityWithTransform } from '../core';

export type EntityGravity = EntityWithTransform & {
  gravity: {
    acceleration: number;
    velocity: number;
    yLast?: number;
    timeLast: number;
  };
};
export const EntityGravity = defineComponent<EntityGravity>()
  .with(`gravity`, ({ acceleration = -9.8 * 0.01 }: { acceleration?: number }) => ({
    acceleration,
    velocity: 0,
    yLast: undefined,
    timeLast: Date.now(),
  }))
  .attach({
    fall: (entity: EntityGravity) => {
      const now = Date.now();

      const pos = entity.transform.position;
      const y = pos.y;
      const yDelta = entity.gravity.yLast ? y - entity.gravity.yLast : undefined;
      const timeDeltaSecs = (now - entity.gravity.timeLast) / 1000;
      entity.gravity.yLast = y;
      entity.gravity.timeLast = now;

      if (yDelta == null) {
        return;
      }

      entity.gravity.velocity = yDelta / timeDeltaSecs;
      if (entity.gravity.velocity > entity.gravity.acceleration) {
        entity.gravity.velocity = 0;
      }
      entity.gravity.velocity += entity.gravity.acceleration;
      pos.setY(y + entity.gravity.velocity * timeDeltaSecs);
    },
  });
