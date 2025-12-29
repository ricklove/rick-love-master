/* eslint-disable no-bitwise */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute, DynamicDrawUsage, Mesh, PlaneGeometry } from 'three';
import { usePlayer } from '../components/camera';
import { useIsomorphicLayoutEffect } from '../utils/layoutEffect';
import { logger } from '../utils/logger';

const createRandomGroundHeight = (segments: number) => {
  // positions are row (x), then column (z)

  const edgeCount = segments + 1;
  const iCenter = 0.5 * segments;
  const jCenter = 0.5 * segments;

  const grid = new Float32Array(edgeCount * edgeCount);
  for (let i = 0; i < edgeCount; i++) {
    for (let j = 0; j < edgeCount; j++) {
      grid[j * edgeCount + i] = Math.sin(i);
      // grid[j * edgeCount + i] = (i - iCenter) / edgeCount;
    }
  }

  const getHeightAtPoint = (x: number, z: number, segmentWidth: number, heightMultiplier: number): number => {
    // i==0 is far left edge
    const i = x / segmentWidth + iCenter;
    const j = z / segmentWidth + jCenter;

    const l = i | 0;
    const r = l + 1;
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

    const y = ave * heightMultiplier;

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
      y: y.toFixed(3),
      ave: ave.toFixed(3),
    });
    return y;
  };

  return {
    grid,
    getHeightAtPoint,
  };
};

export const RandomGround = ({
  segmentWidth = 32,
  segments = 16,
  heightMultiplier = 5,
  movePlayerToGroundHeight = true,
}: {
  segmentWidth?: number;
  segments?: number;
  heightMultiplier?: number;
  movePlayerToGroundHeight?: boolean;
}) => {
  const ref = useRef<Mesh>(null);
  const groundHeight = useRef(createRandomGroundHeight(segments));

  useIsomorphicLayoutEffect(() => {
    const geometry = ref.current?.geometry as PlaneGeometry;
    if (!geometry) {
      return;
    }

    geometry.rotateX(-Math.PI / 2);
    const position = geometry.getAttribute(`position`) as BufferAttribute;
    position.usage = DynamicDrawUsage;

    // logger.log(`RandomGround`, { positionCount: position.count, gridLength: groundHeight.current.grid.length });

    for (let i = 0; i < position.count; i++) {
      // positions are row (x), then column (z)
      const y = heightMultiplier * groundHeight.current.grid[i];
      position.setY(i, y);
    }

    position.needsUpdate = true;
  }, []);

  // const raycasterRef = useRef(new Raycaster());

  const player = usePlayer();

  useFrame(() => {
    if (!movePlayerToGroundHeight) {
      return;
    }

    const y = groundHeight.current.getHeightAtPoint(
      player.position.x,
      player.position.z,
      segmentWidth,
      heightMultiplier,
    );

    player.position.setY(y);

    // // Raycasting
    // const ground = ref.current;
    // if (!ground) {
    //   return;
    // }

    // const raycaster = raycasterRef.current;

    // raycaster.set(player.position.clone().setY(heightMultiplier + 2), new Vector3(0, -1, 0));
    // const [intersection] = raycasterRef.current.intersectObject(ground, false);
    // if (!intersection) {
    //   return;
    // }

    // const yRay = intersection.point.y;
    // logger.log(`ground y`, { y: y.toFixed(3), yRay: yRay.toFixed(3) });

    // // player.position.setY(intersection.point.y);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[segmentWidth * segments, segmentWidth * segments, segments, segments]} />
      <meshStandardMaterial color={`#565656`} />
    </mesh>
  );
};
