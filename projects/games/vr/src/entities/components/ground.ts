import { defineComponent, Vector3 } from '../core';

export type EntityAdjustToGround = {
  transform: {
    position: Vector3;
  };
  adjustToGround: {
    active: true;
    minGroundHeight?: number;
    maxGroundHeight?: number;
  };
};
export const EntityAdjustToGround = defineComponent<EntityAdjustToGround>()
  .with(
    `adjustToGround`,
    ({ minGroundHeight = 0, maxGroundHeight }: { minGroundHeight?: number; maxGroundHeight?: number }) => ({
      active: true,
      minGroundHeight,
      maxGroundHeight,
    }),
  )
  .attach({
    adjustToGround: (entity: EntityAdjustToGround, ground: EntityGround) => {
      if (!entity.adjustToGround.active) {
        return;
      }
      const pos = entity.transform.position;
      const y = pos.y;
      const yGround = EntityGround.getWorldHeightAtPoint(ground, pos.x, pos.z);
      const { minGroundHeight, maxGroundHeight } = entity.adjustToGround;

      if (minGroundHeight != null && y < yGround + minGroundHeight) {
        pos.setY(yGround + minGroundHeight);
      }
      if (maxGroundHeight != null && y > yGround + maxGroundHeight) {
        pos.setY(yGround + maxGroundHeight);
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
      // const iCenter = 0.5 * segmentCount;

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
    getLocalHeightAtGridIndex: (ground: EntityGround, i: number) => {
      const { position } = ground.transform;
      const c = ground.ground;
      return c.grid[i] * (c.maxHeight - c.minHeight) + c.minHeight + position.y;
    },
    getWorldHeightAtPoint: (ground: EntityGround, x: number, z: number) => getHeightAtPoint(ground, x, z),
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

  const y = ave * (maxHeight - minHeight) + minHeight + position.y;

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
