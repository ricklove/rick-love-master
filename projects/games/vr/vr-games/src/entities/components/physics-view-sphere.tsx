import React, { useMemo, useRef } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Color, InstancedMesh, Matrix4, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { logger } from '../../utils/logger';
import { cloneComponent, EntityBase } from '../core';
import { EntityPhysicsView } from './physics-view';

export type EntityPhysicsViewSphere = EntityPhysicsView & {
  sphere: {
    radius: number;
    _scale: Vector3;
  };
  three: {
    matrix: Matrix4;
  };
};
export const EntityPhysicsViewSphere = cloneComponent<EntityPhysicsViewSphere>()(EntityPhysicsView)
  .with(`sphere`, ({ radius }: { radius: number }) => ({
    radius,
    _scale: new Vector3(radius, radius, radius),
  }))
  .with(`three`, ({}: {}) => ({
    matrix: new Matrix4(),
  }))
  .with(`view`, ({ debugColorRgba, enablePhysics = true }: { debugColorRgba?: number; enablePhysics?: boolean }, e) => {
    e.physics.enabled = enablePhysics;

    return {
      debugColorRgba,

      Component: () => <></>,
      batchKey: enablePhysics ? `EntityPhysicsViewSphere` : `EntityViewSphere`,
      BatchComponent: ({ entities }: { entities: EntityBase[] }) =>
        enablePhysics ? (
          <EntityPhysicsViewSphereBatchComponent entities={entities as EntityPhysicsViewSphere[]} />
        ) : (
          <EntityViewSphereBatchComponent entities={entities as EntityPhysicsViewSphere[]} />
        ),
    };
  })
  .attach({
    move: (e: EntityPhysicsViewSphere, pos: Vector3) => {
      if (e.physics.enabled) {
        e.physics.api.position.copy(pos);
        return;
      }
      e.transform.position.copy(pos);
    },
  });

const EntityPhysicsViewSphereBatchComponent = ({ entities }: { entities: EntityPhysicsViewSphere[] }) => {
  const count = entities.length;
  // logger.log(`EntityPhysicsViewSphereBatchComponent`, { count, entities });
  const [ref, api] = useSphere(
    (index) => ({
      type:
        entities[index].physics.kind === `static`
          ? `Static`
          : entities[index].physics.kind === `kinematic`
          ? `Kinematic`
          : undefined,
      collisionFilterGroup: entities[index].collisionFilterGroup?.group,
      collisionFilterMask: entities[index].collisionFilterGroup?.mask,
      args: [entities[index].sphere.radius],
      mass: entities[index].physics.mass,
      material: entities[index].physics.material,
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
      const rad = entities[i].sphere.radius;
      api.at(i).scaleOverride([rad, rad, rad]);
      logger.log(`EntityPhysicsViewSphereBatchComponent scale`, { i, rad, n: x.name, k: x.key });

      EntityPhysicsView.register(x, api.at(i));
      x.ready.next(true);
    });

    r.instanceMatrix.needsUpdate = true;
  }, [!ref.current?.instanceColor, count]);

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <sphereBufferGeometry args={[undefined, 16, 16]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 4]} />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};

const EntityViewSphereBatchComponent = ({ entities }: { entities: EntityPhysicsViewSphere[] }) => {
  const count = entities.length;
  const ref = useRef<InstancedMesh>(null);
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
      const rad = entities[i].sphere.radius;
      const scale = entities[i].sphere._scale.set(rad, rad, rad);
      x.three.matrix.compose(x.transform.position, x.transform.quaternion, scale);

      // x.three.matrix.fromArray(r.instanceMatrix.array, i * 16);

      x.ready.next(true);
    });
    r.instanceMatrix.needsUpdate = true;
  }, [!ref.current?.instanceColor, count]);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    const r = ref.current;
    entities.forEach((x, i) => {
      // move to data
      const rad = entities[i].sphere.radius;
      const scale = entities[i].sphere._scale.set(rad, rad, rad);
      x.three.matrix.compose(x.transform.position, x.transform.quaternion, scale);
      r.setMatrixAt(i, x.three.matrix);
    });
    r.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <sphereBufferGeometry args={[1, 16, 16]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 4]} />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
