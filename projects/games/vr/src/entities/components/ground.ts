import { logger } from '../../utils/logger';
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

      logger.log(`adjustToGround`, { y, yGround });
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
      const iCenter = 0.5 * segmentCount;
      const jCenter = 0.5 * segmentCount;

      const grid = new Float32Array(edgeCount * edgeCount);
      for (let i = 0; i < edgeCount; i++) {
        for (let j = 0; j < edgeCount; j++) {
          // grid values should be between 0-1

          // Rolling Mountains
          grid[j * edgeCount + i] = 0.5 + 0.5 * (Math.cos(0.73 * i) * Math.sin(0.31 * j));

          // // Sharp Mountains
          // grid[j * edgeCount + i] = 0.5 +0.5*(Math.sin(j * edgeCount + i));

          // Wavy
          // grid[j * edgeCount + i] = 0.5 +0.5*(Math.sin(i));

          // Plane
          // grid[j * edgeCount + i] = j / segmentCount;
          // grid[j * edgeCount + i] = i / segmentCount;
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
    getLocalHeightAtGridIndex: (entity: EntityGround, index: number) => {
      const { grid, segmentCount, minHeight, maxHeight } = entity.ground;
      return grid[index] * (maxHeight - minHeight) + minHeight;
    },
    to2dHeightArray: (entity: EntityGround) => {
      const { grid, segmentCount, minHeight, maxHeight } = entity.ground;

      const edgeCount = segmentCount + 1;
      const heights = new Array(edgeCount) as number[][];
      for (let i = 0; i < edgeCount; i++) {
        heights[i] = new Array(edgeCount);
        for (let j = 0; j < edgeCount; j++) {
          heights[i][j] = grid[j * edgeCount + i] * (maxHeight - minHeight) + minHeight;
        }
      }
      return heights;
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
  const jInv = (z - position.z) / segmentSize + jCenter;
  const j = segmentCount - jInv;

  // eslint-disable-next-line no-bitwise
  const l = Math.max(0, Math.min(edgeCount - 2, i | 0));
  const r = l + 1;
  // eslint-disable-next-line no-bitwise
  const t = Math.max(0, Math.min(edgeCount - 2, j | 0));
  const b = t + 1;

  const tl = grid[t * edgeCount + l] || 0;
  const tr = grid[t * edgeCount + r] || 0;
  const bl = grid[b * edgeCount + l] || 0;
  const br = grid[b * edgeCount + r] || 0;

  const bRatio = t === j ? 0 : j < 0 ? 0 : j > segmentCount ? 1 : j % 1;
  const rRatio = l === i ? 0 : i < 0 ? 0 : i > segmentCount ? 1 : i % 1;
  const tRatio = 1 - bRatio;
  const lRatio = 1 - rRatio;

  const tlRatio = tRatio * lRatio;
  const trRatio = tRatio * rRatio;
  const blRatio = bRatio * lRatio;
  const brRatio = bRatio * rRatio;

  // prettier-ignore
  const ave = 0
    + tl * tlRatio
    + tr * trRatio
    + bl * blRatio
    + br * brRatio;

  const y = ave * (maxHeight - minHeight) + minHeight + position.y;

  logger.log(`h`, {
    x: x.toFixed(3),
    z: z.toFixed(3),
    i: i.toFixed(3),
    j: j.toFixed(3),
  });
  logger.log(`h`, {
    t: t,
    l: l,
    b: b,
    r: r,
  });
  logger.log(`h`, {
    tR: tRatio.toFixed(3),
    lR: lRatio.toFixed(3),
    bR: bRatio.toFixed(3),
    rR: rRatio.toFixed(3),
  });
  logger.log(`h`, {
    tl: tl.toFixed(3),
    tr: tr.toFixed(3),
    bl: bl.toFixed(3),
    br: br.toFixed(3),
  });
  logger.log(`h`, {
    tlR: tlRatio.toFixed(3),
    trR: trRatio.toFixed(3),
    blR: blRatio.toFixed(3),
    brR: brRatio.toFixed(3),
  });
  logger.log(`h`, {
    y: y.toFixed(3),
    ave: ave.toFixed(3),
    gy: position.y.toFixed(3),
    min: minHeight.toFixed(3),
    max: maxHeight.toFixed(3),
  });
  return y;
};
