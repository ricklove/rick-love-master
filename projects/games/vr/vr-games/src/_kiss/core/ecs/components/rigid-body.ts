import { RigidBody, RigidBodyDesc, RigidBodyType } from '@dimforge/rapier3d-compat';
import { Quaternion, Vector3 } from 'three';
import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { PhysicsService } from '../physics-service';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type Entity_RigidBody = {
  rigidBody: {
    kind: `fixed` | `dynamic` | `kinematicPositionBased` | `kinematicVelocityBased`;
    gravityScale?: number;
    collisionTag?: string;
  };
};

export type EntityInstance_RigidBody = {
  rigidBody: {
    rigidBody: RigidBody;
    collisionTag?: string;
    onCollision?: (other: undefined | EntityInstance_RigidBody, started: boolean) => void;
  };
};

export const rigidBodyComponentFactory = ({ physicsService }: { physicsService: PhysicsService }) =>
  createComponentFactory<Entity_Transform, Entity_RigidBody, EntityInstance_Transform, EntityInstance_RigidBody>()(
    () => {
      const v = new Vector3();
      const q = new Quaternion();
      return {
        name: `rigidBody`,
        addComponent: (entity, args: Entity_RigidBody[`rigidBody`]) => {
          return {
            ...entity,
            rigidBody: {
              ...args,
            },
          };
        },
        setup: (entityInstance) => {
          const entity = entityInstance.desc;
          const kind = entity.rigidBody.kind ?? `dynamic`;
          const position = entity.transform.position;
          const quaternion = entity.transform.quaternion;

          let rigidBodyDesc = (
            kind === `fixed`
              ? RigidBodyDesc.fixed()
              : kind === `kinematicPositionBased`
              ? RigidBodyDesc.kinematicPositionBased()
              : kind === `kinematicVelocityBased`
              ? RigidBodyDesc.kinematicVelocityBased()
              : RigidBodyDesc.dynamic()
          )
            .setTranslation(position[0], position[1], position[2])
            .setRotation(q.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]));

          if (entity.rigidBody.gravityScale != null) {
            rigidBodyDesc = rigidBodyDesc.setGravityScale(entity.rigidBody.gravityScale);
          }

          const rigidBody = physicsService.world.createRigidBody(rigidBodyDesc);
          physicsService.handleEntityIds.set(rigidBody.handle, entityInstance.instanceId);
          wogger.log(`rigidBody setup`, { rigidBody, entityInstance });

          return {
            ...entityInstance,
            rigidBody: {
              rigidBody,
              collisionTag: entity.rigidBody.collisionTag,
            },
          };
        },
        destroy: (entityInstance) => {
          physicsService.world.removeRigidBody(entityInstance.rigidBody.rigidBody);
        },
        activate: (entityInstance) => {
          const entity = entityInstance.desc;

          const { position, quaternion } = entity.transform;
          entityInstance.rigidBody.rigidBody.setTranslation(v.set(position[0], position[1], position[2]), false);
          entityInstance.rigidBody.rigidBody.setRotation(
            q.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]),
            false,
          );

          const kind =
            entity.rigidBody.kind === `fixed`
              ? RigidBodyType.Fixed
              : entity.rigidBody.kind === `kinematicPositionBased`
              ? RigidBodyType.KinematicPositionBased
              : entity.rigidBody.kind === `kinematicVelocityBased`
              ? RigidBodyType.KinematicVelocityBased
              : RigidBodyType.Dynamic;
          entityInstance.rigidBody.rigidBody.setBodyType(kind, true);

          wogger.log(`rigidBody activate`, { entityInstance });
        },
        deactivate: (entityInstance) => {
          entityInstance.rigidBody.rigidBody.setBodyType(RigidBodyType.Fixed, true);
          entityInstance.rigidBody.rigidBody.sleep();

          wogger.log(`rigidBody deactivate`, { entityInstance });
        },
        update: (entityInstance) => {
          const translation = entityInstance.rigidBody.rigidBody.translation();
          entityInstance.transform.position[0] = translation.x;
          entityInstance.transform.position[1] = translation.y;
          entityInstance.transform.position[2] = translation.z;

          const rotation = entityInstance.rigidBody.rigidBody.rotation();
          entityInstance.transform.quaternion[0] = rotation.x;
          entityInstance.transform.quaternion[1] = rotation.y;
          entityInstance.transform.quaternion[2] = rotation.z;
          entityInstance.transform.quaternion[3] = rotation.w;

          // wogger.log(`rigidBody update`, { entityInstance });
        },
      };
    },
  );
