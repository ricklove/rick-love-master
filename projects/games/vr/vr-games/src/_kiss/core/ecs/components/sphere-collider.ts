import { ColliderDesc, World } from '@dimforge/rapier3d-compat';
import { createComponentFactory } from '../ecs-component-factory';
import { EntityInstance_RigidBody } from './rigid-body';
import { Entity_Sphere } from './sphere';

export type Entity_SphereCollider = {
  sphereCollider: {
    restitution?: number;
    friction?: number;
    colliderEvents?: boolean;
    sensor?: boolean;
  };
};

export const sphereColliderComponentFactory = ({ world }: { world: World }) =>
  createComponentFactory<Entity_Sphere, Entity_SphereCollider, EntityInstance_RigidBody>()(`sphereCollider`, () => {
    return {
      addComponent: (
        entity,
        {
          restitution,
          friction,
          colliderEvents,
          sensor,
        }: {
          restitution?: number;
          friction?: number;
          colliderEvents?: boolean;
          sensor?: boolean;
        },
      ) => {
        return {
          ...entity,
          sphereCollider: {
            restitution,
            friction,
            colliderEvents,
            sensor,
          },
        };
      },
      setup: (entity, parent) => {
        let colliderDesc = ColliderDesc.ball(entity.sphere.radius);
        if (entity.sphereCollider.restitution) {
          colliderDesc = colliderDesc.setRestitution(entity.sphereCollider.restitution);
        }
        if (entity.sphereCollider.friction) {
          colliderDesc = colliderDesc.setFriction(entity.sphereCollider.friction);
        }
        if (entity.sphereCollider.sensor) {
          colliderDesc = colliderDesc.setSensor(true);
        }
        world.createCollider(colliderDesc, parent.rigidBody.rigidBody);
        return entity;
      },
    };
  });
