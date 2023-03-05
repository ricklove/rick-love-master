import React, { useMemo, useRef } from 'react';
import { Triplet, useHeightfield } from '@react-three/cannon';
import { BufferAttribute, BufferGeometry, DoubleSide, DynamicDrawUsage, Mesh, PlaneGeometry, Vector3 } from 'three';
import { Float32BufferAttribute } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';
import { EntityGround } from './ground';

export type EntityGroundView = EntityBase &
  EntityGround & {
    transform: {
      position: Vector3;
    };
    view: {
      Component: (props: { entity: EntityBase }) => JSX.Element;
    };
  };

export const EntityGroundView = defineComponent<EntityGroundView>()
  .with(`view`, () => ({
    // Component: (x) => <EntityGroundViewComponent ground={x.entity as EntityGroundView} />,
    Component: (x) => (
      <>
        <EntityHeightFieldComponent entity={x.entity as EntityGroundView} />
        {/* <group position={[0, 0.1, 0]}>
          <EntityGroundViewComponent ground={x.entity as EntityGroundView} />
        </group> */}
      </>
    ),
  }))
  .with(`transform`, () => ({
    // Will be created by the component
    position: undefined as unknown as Vector3,
  }));

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
      const y = EntityGround.getLocalHeightAtGridIndex(ground, i);
      position.setY(i, y);
    }

    position.needsUpdate = true;
    // geometry.computeVertexNormals();
    // geometry.computeBoundingBox();
    // geometry.computeBoundingSphere();
  }, []);

  const { segmentCount, segmentSize } = ground.ground;
  return (
    <mesh ref={ref}>
      <planeGeometry args={[segmentSize * segmentCount, segmentSize * segmentCount, segmentCount, segmentCount]} />
      <meshStandardMaterial color={`#565656`} side={DoubleSide} transparent={true} opacity={0.5} />
    </mesh>
  );
};

// Based on: https://github.com/pmndrs/use-cannon/blob/master/packages/react-three-cannon-examples/src/colors.ts
const niceColors = [`#99b898`, `#fecea8`, `#ff847c`, `#e84a5f`, `#2a363b`] as const;

const EntityHeightFieldComponent = ({ entity }: { entity: EntityGroundView }) => {
  const { segmentCount, segmentSize } = entity.ground;
  const fieldSize = segmentCount * segmentSize;
  const position = [-fieldSize / 2, 0, fieldSize / 2] as Triplet;
  const rotation = [-Math.PI / 2, 0, 0] as Triplet;
  // const { position } = entity.transform;
  const heights = useMemo(() => EntityGround.to2dHeightArray(entity), []);

  const [ref] = useHeightfield(
    () => ({
      args: [
        heights,
        {
          elementSize: segmentSize,
        },
      ],
      position,
      rotation,
    }),
    useRef<Mesh>(null),
  );

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    // Assign mesh
    entity.transform.position = new Vector3();
  }, []);

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <meshPhongMaterial color={niceColors[4]} side={DoubleSide} />
      <HeightmapGeometry heights={heights} segmentSize={segmentSize} />
    </mesh>
  );
};

function HeightmapGeometry({ segmentSize, heights }: { segmentSize: number; heights: number[][] }): JSX.Element {
  const ref = useRef<BufferGeometry>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;
    const dx = segmentSize;
    const dy = segmentSize;

    /* Create the vertex data from the heights. */
    const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]));

    /* Create the faces. */
    const indices = [];
    for (let i = 0; i < heights.length - 1; i++) {
      for (let j = 0; j < heights[i].length - 1; j++) {
        const stride = heights[i].length;
        const index = i * stride + j;
        indices.push(index + 1, index + stride, index + stride + 1);
        indices.push(index + stride, index + 1, index);
      }
    }

    ref.current.setIndex(indices);
    ref.current.setAttribute(`position`, new Float32BufferAttribute(vertices, 3));
    ref.current.computeVertexNormals();
    ref.current.computeBoundingBox();
    ref.current.computeBoundingSphere();
  }, [heights]);

  return <bufferGeometry ref={ref} />;
}
