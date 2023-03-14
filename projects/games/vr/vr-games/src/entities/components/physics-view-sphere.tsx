import React, { useMemo, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
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
  .with(`view`, ({ debugColorRgba }: { debugColorRgba?: number }) => ({
    debugColorRgba,

    Component: () => <></>,
    batchKey: `EntityPhysicsViewSphere`,
    BatchComponent: ({ entities }: { entities: EntityBase[] }) => (
      <EntityPhysicsViewSphereBatchComponent entities={entities as EntityPhysicsViewSphere[]} />
    ),
  }));

const EntityPhysicsViewSphereBatchComponent = ({ entities }: { entities: EntityPhysicsViewSphere[] }) => {
  const count = entities.length;
  // logger.log(`EntityPhysicsViewSphereBatchComponent`, { count, entities });
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
    [count],
  );
  const colors = useMemo(() => {
    const array = new Float32Array(count * 4);
    const color = new Color();
    for (let i = 0; i < count; i++) {
      const c = entities[i].view.debugColorRgba ?? 0xffffffff;
      color.set(c >> 8).toArray(array, i * 4);
      array[i * 4 + 3] = c % 0x100;
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
      const rad = entities[i].sphere.radius;
      api.at(i).scaleOverride([rad, rad, rad]);

      EntityPhysicsView.register(x, api.at(i));
      x.ready.next(true);
    });

    r.instanceMatrix.needsUpdate = true;
  }, [!ref.current?.instanceColor, count]);

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <sphereBufferGeometry args={[1, 16, 16]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 4]} />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
