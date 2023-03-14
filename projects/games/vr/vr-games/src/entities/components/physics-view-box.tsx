import React, { useMemo, useRef } from 'react';
import { Triplet, useBox } from '@react-three/cannon';
import { Color, InstancedMesh } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { cloneComponent, EntityBase } from '../core';
import { EntityPhysicsView } from './physics-view';

export type EntityPhysicsViewBox = EntityPhysicsView & {
  box: {
    scale: Triplet;
    startRotation: Triplet;
  };
};
export const EntityPhysicsViewBox = cloneComponent<EntityPhysicsViewBox>()(EntityPhysicsView)
  .with(`box`, ({ scale, startRotation }: { scale: Triplet; startRotation: Triplet }) => ({
    scale,
    startRotation,
  }))
  .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
    debugColor,

    Component: () => <></>,
    batchKey: `EntityPhysicsViewBox`,
    BatchComponent: ({ entities }: { entities: EntityBase[] }) => (
      <EntityPhysicsViewBoxBatchComponent entities={entities as EntityPhysicsViewBox[]} />
    ),
  }));

const EntityPhysicsViewBoxBatchComponent = ({ entities }: { entities: EntityPhysicsViewBox[] }) => {
  const count = entities.length;
  // logger.log(`EntityPhysicsViewBoxBatchComponent`, { count, entities });
  const [ref, api] = useBox(
    (index) => ({
      args: entities[index].box.scale,
      mass: entities[index].physics.mass,
      position: [
        entities[index].transform.position.x,
        entities[index].transform.position.y,
        entities[index].transform.position.z,
      ],
      rotation: entities[index].box.startRotation,
      onCollideBegin: (e) => EntityPhysicsView.collide(entities[index], e),
      onCollide: (e) => EntityPhysicsView.collide(entities[index], e),
      onCollideEnd: (e) => EntityPhysicsView.collide(entities[index], e),
    }),
    useRef<InstancedMesh>(null),
    [count],
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
      api.at(i).scaleOverride(entities[i].box.scale);

      EntityPhysicsView.register(x, api.at(i));
      x.ready.next(true);
    });

    r.instanceMatrix.needsUpdate = true;
  }, [!ref.current?.instanceColor, count]);

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <boxBufferGeometry args={[1, 1, 1]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 3]} />
      </boxBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
