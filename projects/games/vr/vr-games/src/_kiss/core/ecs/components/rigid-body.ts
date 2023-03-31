import { RigidBody, RigidBodyDesc, RigidBodyType, World } from '@dimforge/rapier3d-compat';
import { Quaternion } from 'three';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type Entity_RigidBody = {
  rigidBody: {
    kind: `fixed` | `dynamic` | `kinematicPositionBased` | `kinematicVelocityBased`;
    gravityScale?: number;
  };
};

export type EntityInstance_RigidBody = {
  rigidBody: {
    rigidBody: RigidBody;
  };
};

export const rigidBodyComponentFactory = ({ physicsWorld }: { physicsWorld: World }) =>
  createComponentFactory<Entity_Transform, Entity_RigidBody, EntityInstance_Transform, EntityInstance_RigidBody>()(
    () => {
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
            .setTranslation(...position)
            .setRotation(q.set(...quaternion));

          if (entity.rigidBody.gravityScale != null) {
            rigidBodyDesc = rigidBodyDesc.setGravityScale(entity.rigidBody.gravityScale);
          }

          return {
            ...entityInstance,
            rigidBody: {
              rigidBody: physicsWorld.createRigidBody(rigidBodyDesc),
            },
          };
        },
        activate: (entityInstance) => {
          const entity = entityInstance.desc;
          const kind =
            entity.rigidBody.kind === `fixed`
              ? RigidBodyType.Fixed
              : entity.rigidBody.kind === `kinematicPositionBased`
              ? RigidBodyType.KinematicPositionBased
              : entity.rigidBody.kind === `kinematicVelocityBased`
              ? RigidBodyType.KinematicVelocityBased
              : RigidBodyType.Dynamic;
          entityInstance.rigidBody.rigidBody.setBodyType(kind, true);
        },
        deactivate: (entityInstance) => {
          entityInstance.rigidBody.rigidBody.setBodyType(RigidBodyType.Fixed, true);
          entityInstance.rigidBody.rigidBody.sleep();
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
        },
      };
    },
  );
