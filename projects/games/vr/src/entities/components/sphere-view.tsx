/* eslint-disable no-bitwise */
import React, { useRef } from 'react';
import { Mesh, Vector3 } from 'three';
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
    Component: (x) => <EntitySphereViewComponent entity={x.entity as EntitySphereView} />,
  }))
  .with(`transform`, ({ startPosition }: { startPosition?: [number, number, number] }) => ({
    // Will be created by the component
    position: startPosition ? new Vector3(...startPosition) : (undefined as unknown as Vector3),
  }));

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
