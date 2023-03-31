import { RigidBody, RigidBodyDesc, RigidBodyType, World } from '@dimforge/rapier3d-compat';
import { Quaternion } from 'three';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_Transform } from './transform';

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

export const rigidBodyComponentFactory = ({ world }: { world: World }) =>
  createComponentFactory<Entity_Transform, Entity_RigidBody, EntityInstance_RigidBody>()(`rigidBody`, () => {
    const q = new Quaternion();
    return {
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
            rigidBody: world.createRigidBody(rigidBodyDesc),
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
      //   update: (entity) => {
      //     // entity.rigidBody.rigidBody.setTranslation(entity.transform.position);
      //     // entity.rigidBody.rigidBody.setOrientation(entity.transform.rotation);
      //   },
    };
  });
