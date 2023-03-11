import React, { useMemo, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import {} from 'rxjs';
import { Color, InstancedMesh } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { cloneComponent, EntityBase } from '../core';
import { EntityPhysicsView } from './physics-view';

export type EntityPhysicsViewSphere = EntityPhysicsView & {
  sphere: {
    radius: number;
  };
};
export const EntityPhysicsViewSphere = cloneComponent<EntityPhysicsViewSphere>()(EntityPhysicsView)
  .with(`sphere`, ({ radius }: { radius: number }) => ({
    radius,
  }))
  .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
    debugColor,
    Component: () => <></>,
    batchKey: `EntityPhysicsViewSphere`,
    BatchComponent: ({ entities }: { entities: EntityBase[] }) => (
      <EntityPhysicsViewSphereBatchComponent entities={entities as EntityPhysicsViewSphere[]} />
    ),
  }));

const EntityPhysicsViewSphereBatchComponent = ({ entities }: { entities: EntityPhysicsViewSphere[] }) => {
  const count = entities.length;
  const [ref, api] = useSphere(
    (index) => ({
      args: [entities[index].sphere.radius],
      mass: entities[index].physics.mass,
      position: [
        entities[index].transform.position.x,
        entities[index].transform.position.y,
        entities[index].transform.position.z,
      ],
      onCollideBegin: (e) => EntityPhysicsView.collide(entities[index], e),
      onCollide: (e) => EntityPhysicsView.collide(entities[index], e),
      onCollideEnd: (e) => EntityPhysicsView.collide(entities[index], e),
    }),
    useRef<InstancedMesh>(null),
  );
  const colors = useMemo(() => {
    const array = new Float32Array(count * 3);
    const color = new Color();
    for (let i = 0; i < count; i++) {
      color.set(entities[i].view.debugColor ?? 0xffffff).toArray(array, i * 3);
    }
    return array;
  }, [count]);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const r = ref.current;

    entities.forEach((x, i) => {
      api.at(i).position.subscribe((p) => {
        x.transform.position.set(...p);
      });
      EntityPhysicsView.register(x, api.at(i));
    });
  }, [!ref.current?.instanceColor, count]);

  // useFrame(() => {
  //   entities.forEach((x, i) => {
  //     api.at(i).position.subscribe((p) => {
  //       x.transform.position.set(...p);
  //     });
  //   });
  // });

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <sphereBufferGeometry args={[undefined, 16, 16]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 3]} />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
