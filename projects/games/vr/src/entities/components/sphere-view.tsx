import React, { useMemo, useRef } from 'react';
import { useSphere, WorkerApi } from '@react-three/cannon';
import { Color, InstancedMesh, Vector3 } from 'three';
import { useIsomorphicLayoutEffect } from '../../utils/layoutEffect';
import { defineComponent, EntityBase } from '../core';
import { EntitySelectable } from './selectable';

export type EntitySphereView = EntitySelectable & {
  sphere: {
    radius: number;
  };
  transform: {
    position: Vector3;
  };
  physics: {
    api: WorkerApi;
    mass: number;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
    batchKey?: string;
    color?: number;
  };
};

export const EntitySphereView = defineComponent<EntitySphereView>()
  .with(`sphere`, ({ radius }: { radius: number }) => ({
    radius,
  }))
  .with(`transform`, ({ startPosition }: { startPosition?: [number, number, number] }) => ({
    position: startPosition ? new Vector3(...startPosition) : new Vector3(),
  }))
  .with(`physics`, ({ mass }: { mass: number }) => ({
    mass,
    // Will be created by the component
    api: undefined as unknown as WorkerApi,
  }))
  .with(`view`, ({ color }: { color?: number }) => ({
    color,
    Component: () => <></>,
    batchKey: `EntitySphereView`,
    BatchComponent: ({ entities }: { entities: EntityBase[] }) => (
      <EntityPhysicalSpheres entities={entities as EntitySphereView[]} />
    ),
  }));

const EntityPhysicalSpheres = ({ entities }: { entities: EntitySphereView[] }) => {
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
      onCollideBegin: (e) => EntitySelectable.onCollideBegin(entities[index], e),
      onCollide: (e) => EntitySelectable.onCollide(entities[index], e),
      onCollideEnd: (e) => EntitySelectable.onCollideEnd(entities[index], e),
    }),
    useRef<InstancedMesh>(null),
  );
  const colors = useMemo(() => {
    const array = new Float32Array(count * 3);
    const color = new Color();
    for (let i = 0; i < count; i++) {
      color.set(entities[i].view.color ?? 0xffffff).toArray(array, i * 3);
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
      x.selectable.target = r;
      x.selectable.targetInstanceId = i;
      x.physics.api = api.at(i);
    });
  }, [!ref.current?.instanceColor, count]);

  return (
    <instancedMesh ref={ref} castShadow receiveShadow args={[undefined, undefined, count]}>
      <sphereBufferGeometry args={[undefined, 16, 16]}>
        <instancedBufferAttribute attach='attributes-color' args={[colors, 3]} />
      </sphereBufferGeometry>
      <meshPhongMaterial vertexColors />
    </instancedMesh>
  );
};
