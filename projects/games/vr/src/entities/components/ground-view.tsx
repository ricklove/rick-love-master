/* eslint-disable no-bitwise */
import React, { useRef } from 'react';
import { BufferAttribute, DynamicDrawUsage, Mesh, PlaneGeometry, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent } from '../core';
import { EntityGround } from './ground';

export type EntityGroundView = EntityGround & {
  transform: {
    position: Vector3;
  };
  view: {
    Component: (props: { ground: EntityGroundView }) => JSX.Element;
  };
};

export const EntityGroundView = defineComponent<EntityGroundView>().with(`view`, () => ({
  Component: EntityGroundViewComponent,
}));
// .with(`transform`, () => ({
//   position: undefined as unknown as Vector3,
// }));

export const EntityGroundViewComponent = ({ ground }: { ground: EntityGroundView }) => {
  const ref = useRef<Mesh>(null);

  useIsomorphicLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }
    // Assign mesh
    ground.transform = mesh;

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
      const y = EntityGround.getHeightAtGridIndex(ground, i);
      position.setY(i, y);
    }

    position.needsUpdate = true;
  }, []);

  const { segmentCount, segmentSize } = ground.ground;
  return (
    <mesh ref={ref}>
      <planeGeometry args={[segmentSize * segmentCount, segmentSize * segmentCount, segmentCount, segmentCount]} />
      <meshStandardMaterial color={`#565656`} />
    </mesh>
  );
};
