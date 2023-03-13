import React, { useMemo, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { Color, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { logger } from '../../utils/logger';
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
  logger.log(`EntityPhysicsViewSphereBatchComponent`, { count, entities });
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
    const array = new Float32Array(count * 3);
    const color = new Color();
    for (let i = 0; i < count; i++) {
      color.set(entities[i].view.debugColor ?? 0xffffff).toArray(array, i * 3);
    }
    return array;
  }, [count]);

  const calculateMatrix = useMemo(() => {
    // const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    return (position: Vector3, radius: number, out: Matrix4) => {
      // const position = entities[i].transform.position;

      // rotation.x = 0;
      // rotation.y = 0;
      // rotation.z = 0;
      // quaternion.setFromEuler(rotation);

      // default is radius 1
      scale.x = scale.y = scale.z = radius;

      out.compose(position, quaternion, scale);
    };
  }, []);

  const matrices = useMemo(() => {
    const matrix = new Matrix4();

    const array = new Float32Array(count * 16);
    for (let i = 0; i < count; i++) {
      calculateMatrix(entities[i].transform.position, entities[i].sphere.radius, matrix);
      matrix.toArray(array, i * 16);
    }
    return array;
  }, [count]);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const r = ref.current;
    const matrix = new Matrix4();

    entities.forEach((x, i) => {
      // calculateMatrix(entities[i].transform.position, entities[i].sphere.radius, matrix);
      // logger.log(`matrix`, { matrix });
      // r.setMatrixAt(i, matrix);

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
        {/* <instancedBufferAttribute attach='attributes-matrix' args={[matrices, 16]} /> */}
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
