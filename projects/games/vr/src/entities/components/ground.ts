import { defineComponent, Vector3 } from '../core';

export type EntityKeepAboveGround = {
  transform: {
    position: Vector3;
  };
  keepAboveGround: {
    active: true;
    originHeight: number;
  };
};
export const EntityKeepAboveGround = defineComponent<EntityKeepAboveGround>()
  .with(`keepAboveGround`, ({ originHeight = 0 }: { originHeight?: number }) => ({
    active: true,
    originHeight,
  }))
  .attach({
    keepAboveGround: (entity: EntityKeepAboveGround, ground: EntityGround) => {
      if (!entity.keepAboveGround.active) {
        return;
      }
      if (entity.transform.position.y < ground.transform.position.y + entity.keepAboveGround.originHeight) {
        entity.transform.position.setY(ground.transform.position.y + entity.keepAboveGround.originHeight);
      }
    },
  });

export type EntityGround = {
  transform: {
    position: Vector3;
  };
  ground: {
    grid: Float32Array;
    segmentCount: number;
    segmentSize: number;
    minHeight: number;
    maxHeight: number;
  };
};

export const EntityGround = defineComponent<EntityGround>()
  .with(
    `ground`,
    ({
      segmentCount,
      segmentSize,
      minHeight,
      maxHeight,
    }: {
      segmentCount: number;
      segmentSize: number;
      minHeight: number;
      maxHeight: number;
    }) => {
      // positions are row (x), then column (z)

      const edgeCount = segmentCount + 1;

      const grid = new Float32Array(edgeCount * edgeCount);
      for (let i = 0; i < edgeCount; i++) {
        for (let j = 0; j < edgeCount; j++) {
          grid[j * edgeCount + i] = Math.sin(i);
          // grid[j * edgeCount + i] = (i - iCenter) / edgeCount;
        }
      }

      return {
        grid,
        segmentCount,
        segmentSize,
        minHeight,
        maxHeight,
      };
    },
  )
  .attach({
    getHeightAtGridIndex: (ground: EntityGround, i: number) => {
      const c = ground.ground;
      return c.maxHeight + (c.maxHeight - c.minHeight) * c.grid[i];
    },
    getHeightAtPoint: (ground: EntityGround, x: number, z: number) => getHeightAtPoint(ground, x, z),
  });

const getHeightAtPoint = (ground: EntityGround, x: number, z: number): number => {
  const { position } = ground.transform;
  const { grid, segmentCount, segmentSize, minHeight, maxHeight } = ground.ground;
  const edgeCount = segmentCount + 1;

  const iCenter = 0.5 * segmentCount;
  const jCenter = 0.5 * segmentCount;

  // i==0 is far left edge

  const i = (x - position.x) / segmentSize + iCenter;
  const j = (z - position.z) / segmentSize + jCenter;

  // eslint-disable-next-line no-bitwise
  const l = i | 0;
  const r = l + 1;
  // eslint-disable-next-line no-bitwise
  const t = j | 0;
  const b = t + 1;

  const tl = grid[t * edgeCount + l] || 0;
  const tr = grid[t * edgeCount + r] || 0;
  const bl = grid[b * edgeCount + l] || 0;
  const br = grid[b * edgeCount + r] || 0;

  const bRatio = t === j ? 0 : j % 1;
  const rRatio = l === i ? 0 : i % 1;
  const tRatio = 1 - bRatio;
  const lRatio = 1 - rRatio;

  // prettier-ignore
  const ave = 0
    + tl * tRatio * lRatio
    + tr * tRatio * rRatio
    + bl * bRatio * lRatio
    + br * bRatio * rRatio;

  const y = ave * (maxHeight - minHeight) + minHeight * position.y;

  // logger.log(`h`, {
  //   x: x.toFixed(3),
  //   z: z.toFixed(3),
  //   i: i.toFixed(3),
  //   j: j.toFixed(3),
  // });
  // logger.log(`h`, {
  //   t: t,
  //   l: l,
  //   b: b,
  //   r: r,
  // });
  // logger.log(`h`, {
  //   tR: tRatio.toFixed(3),
  //   lR: lRatio.toFixed(3),
  //   bR: bRatio.toFixed(3),
  //   rR: rRatio.toFixed(3),
  // });
  // logger.log(`h`, {
  //   tl: tl.toFixed(3),
  //   tr: tr.toFixed(3),
  //   bl: bl.toFixed(3),
  //   br: br.toFixed(3),
  // });
  // logger.log(`h`, {
  //   y: y.toFixed(3),
  //   ave: ave.toFixed(3),
  // });
  return y;
};
