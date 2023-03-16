import { Triplet, WorkerApi } from '@react-three/cannon';
import { CollideBeginEvent, CollideEndEvent, CollideEvent } from '@react-three/cannon';
import { Material } from 'cannon-es';
import { Subject } from 'rxjs';
import { Quaternion, Vector3 } from 'three';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase, EntityWithTransform } from '../core';

export type EntityCollisionFilterGroup = EntityBase & {
  collisionFilterGroup: {
    group: number;
    mask: number;
  };
};

export const EntityCollisionFilterGroup = defineComponent<EntityCollisionFilterGroup>().with(
  `collisionFilterGroup`,
  ({ group = 1, mask = -1 }: { group?: number; mask?: number }) => ({
    group,
    mask,
  }),
);

export type EntityPhysicsView = EntityWithTransform & {
  physics: {
    enabled: boolean;
    uuid: string;
    api: WorkerApi;
    collideSubject: Subject<{
      entity: EntityPhysicsView;
      other?: EntityPhysicsView;
      sequence: `begin` | `end` | `continue`;
      event: CollideBeginEvent | CollideEndEvent | CollideEvent;
    }>;
    mass: number;
    kind?: `dynamic` | `static` | `kinematic`;
    material?: Material;
  };
  collisionFilterGroup?: {
    group: number;
    mask: number;
  };
  view: {
    debugColorRgba?: number;
    Component: (props: { entity: EntityBase }) => JSX.Element;
    batchKey?: string;
    BatchComponent?: (props: { entities: EntityBase[] }) => JSX.Element;
  };
};

const globalState = {
  physicsViews: {} as { [uuid: string]: EntityPhysicsView },
};

export const EntityPhysicsView = defineComponent<EntityPhysicsView>()
  .with(`transform`, ({ startPosition }: { startPosition?: Triplet }) => ({
    position: startPosition ? new Vector3(...startPosition) : new Vector3(),
    quaternion: new Quaternion(),
    // scale: new Vector3(1, 1, 1),
  }))
  .with(
    `physics`,
    ({ mass, kind, material }: { mass?: number; kind?: `dynamic` | `static` | `kinematic`; material?: Material }) => ({
      kind,
      enabled: true,
      mass: mass ?? 0,
      collideSubject: new Subject(),
      // Will be created by the component
      api: undefined as unknown as WorkerApi,
      uuid: ``,
      material,
    }),
  )
  // .with(`view`, ({ debugColor }: { debugColor?: number }) => ({
  //   debugColor,
  //   Component: () => <></>,
  // }))
  .attach({
    register: (
      entity: EntityPhysicsView,
      api: WorkerApi,
      { shouldSubscribeTransformUpdates = true }: { shouldSubscribeTransformUpdates?: boolean } = {},
    ) => {
      if (globalState.physicsViews[entity.physics.uuid]) {
        logger.log(`EntityPhysicsView.register SKIPPED`, { name: entity.name, key: entity.key });

        return;
      }

      entity.physics.api = api;
      entity.physics.uuid = api.uuid() ?? ``;
      if (shouldSubscribeTransformUpdates) {
        api.position.subscribe((x) => {
          entity.transform.position.set(...x);
        });
        api.quaternion.subscribe((x) => {
          entity.transform.quaternion.set(...x);
        });
      }

      logger.log(`EntityPhysicsView.register`, { name: entity.name, key: entity.key });

      globalState.physicsViews[entity.physics.uuid] = entity;
    },
    collide: (entity: EntityPhysicsView, event: CollideBeginEvent | CollideEndEvent | CollideEvent) => {
      const eReg = globalState.physicsViews[event.data.target];
      const other = globalState.physicsViews[event.data.body];
      const sequence = event.type === `collideBegin` ? `begin` : event.type === `collideEnd` ? `end` : `continue`;

      // if (!entity.name.includes(`body`) && !other?.name.includes(`body`)) {
      //   // logger.log(`collide`, {
      //   //   e: entity.name,
      //   //   o: other?.name,
      //   //   sequence,
      //   //   type: event.type,
      //   // });
      //   // logger.log(`collide`, {
      //   //   e: { n: entity.name, k: entity.key },
      //   //   r: { n: eReg?.name, k: eReg?.key },
      //   //   o: { n: other?.name, k: other?.key },
      //   // });
      //   // logger.log(`enti uuid`, {
      //   //   e: entity.physics.uuid,
      //   // });
      //   // logger.log(`body uuid`, {
      //   //   b: event.data.body,
      //   // });
      //   // logger.log(`targ uuid`, {
      //   //   t: event.data.target,
      //   // });
      // }
      entity.physics.collideSubject.next({ entity, event, other, sequence });
    },
    // getEntityKey: (o:Object3D)=>{
    //   return `${o.uuid}${suffix}`;
    // },
  });
