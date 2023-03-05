import React, { useMemo, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { Color, InstancedMesh, Mesh, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';

export type EntitySphereView = EntityBase & {
  sphere: {
    radius: number;
  };
  transform: {
    position: Vector3;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
    color?: number;
  };
};

export const EntitySphereView = defineComponent<EntitySphereView>()
  .with(`sphere`, ({ radius }: { radius: number }) => ({
    radius,
  }))
  .with(`view`, ({ color }: { color?: number }) => ({
    color,
    Component: (x) => (
      <>
        {/* <EntityPhysicalSphere entity={x.entity as EntitySphereView} /> */}
        {/* <group position={[0, 0.1, 0]}>
      <EntitySphereViewComponent entity={x.entity as EntitySphereView} />
    </group> */}
      </>
    ),
  }))
  .with(`transform`, ({ startPosition }: { startPosition?: [number, number, number] }) => ({
    // Will be created by the component
    position: startPosition ? new Vector3(...startPosition) : (undefined as unknown as Vector3),
  }))
  .attach({
    BatchComponent: ({ entities }: { entities: EntitySphereView[] }) => <EntityPhysicalSpheres entities={entities} />,
  });

export const EntitySphereViewComponent = ({ entity }: { entity: EntitySphereView }) => {
  const ref = useRef<Mesh>(null);

  useIsomorphicLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) {
      return;
    }

    // Assign mesh
    const startPos = entity.transform.position;
    if (startPos) {
      mesh.position.copy(startPos);
    }
    entity.transform = mesh;
  }, []);

  const { radius } = entity.sphere;
  const { color } = entity.view;
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Based on: https://github.com/pmndrs/use-cannon/blob/master/packages/react-three-cannon-examples/src/colors.ts
const niceColors = [`#99b898`, `#fecea8`, `#ff847c`, `#e84a5f`, `#2a363b`] as const;

const EntityPhysicalSpheres = ({ entities }: { entities: EntitySphereView[] }) => {
  //{ columns, rows, spread }: { columns: number; rows: number; spread: number }
  const count = entities.length;
  const [ref] = useSphere(
    (index) => ({
      args: [entities[index].sphere.radius],
      mass: 1,
      position: [
        entities[index].transform.position.x,
        entities[index].transform.position.y,
        entities[index].transform.position.z,
        // ((index % columns) - (columns - 1) / 2) * spread,
        // 2.0,
        // (Math.floor(index / columns) - (rows - 1) / 2) * spread,
      ],
    }),
    useRef<InstancedMesh>(null),
  );
  const colors = useMemo(() => {
    const array = new Float32Array(count * 3);
    const color = new Color();
    for (let i = 0; i < count; i++)
      color
        // .set(niceColors[Math.floor(Math.random() * 5)])
        // .convertSRGBToLinear()
        .set(entities[i].view.color ?? 0xffffff)
        .toArray(array, i * 3);
    return array;
  }, [count]);

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <sphereBufferGeometry args={[undefined, 16, 16]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 3]} />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
