import RAPIER, { Collider, ColliderDesc } from '@dimforge/rapier3d-compat';
import { Quaternion } from 'three';
import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { PhysicsService } from '../physics-service';
import { EntityInstance_RigidBody } from './rigid-body';
import { Entity_ShapeBox } from './shape-box';
import { Entity_ShapeSphere } from './shape-sphere';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type Entity_Collider = {
  collider: {
    restitution?: number;
    friction?: number;
    colliderEvents?: boolean;
    sensor?: boolean;
  };
};

export type EntityInstance_Collider = {
  collider: {
    collider: Collider;
  };
};

export type Entity_Shape = Entity_ShapeBox | Entity_ShapeSphere;

export const colliderComponentFactory = ({ physicsService }: { physicsService: PhysicsService }) =>
  createComponentFactory<
    Entity_Transform & Entity_Shape,
    Entity_Collider,
    EntityInstance_Transform,
    EntityInstance_Collider,
    EntityInstance_RigidBody
  >()(() => {
    const q = new Quaternion();
    return {
      name: `collider`,
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
          collider: {
            restitution,
            friction,
            colliderEvents,
            sensor,
          },
        };
      },
      setup: (entityInstance, parentInstance) => {
        const entity = entityInstance.desc;

        let colliderDesc =
          entity.shape.kind === `box`
            ? ColliderDesc.cuboid(entity.shape.scale[0] * 0.5, entity.shape.scale[1] * 0.5, entity.shape.scale[2] * 0.5)
            : entity.shape.kind === `sphere`
            ? ColliderDesc.ball(entity.shape.radius)
            : undefined;

        if (!colliderDesc) throw new Error(`ColliderDesc not defined`);

        const { position, quaternion } = entityInstance.transform;
        colliderDesc.setTranslation(position[0], position[1], position[2]);
        colliderDesc.setRotation(q.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]));

        if (entity.collider.restitution) {
          colliderDesc = colliderDesc.setRestitution(entity.collider.restitution);
        }
        if (entity.collider.friction) {
          colliderDesc = colliderDesc.setFriction(entity.collider.friction);
        }
        if (entity.collider.sensor) {
          colliderDesc = colliderDesc.setSensor(true);
        }
        if (entity.collider.colliderEvents) {
          colliderDesc = colliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        }

        const collider = physicsService.world.createCollider(colliderDesc, parentInstance.rigidBody.rigidBody);
        physicsService.handleEntityIds.set(collider.handle, entityInstance.instanceId);
        wogger.log(`collider setup`, { collider, parentInstance, entityInstance });

        return {
          ...entityInstance,
          collider: {
            collider,
          },
        };
      },
      update: (entityInstance) => {
        const translation = entityInstance.collider.collider.translation();
        entityInstance.transform.position[0] = translation.x;
        entityInstance.transform.position[1] = translation.y;
        entityInstance.transform.position[2] = translation.z;

        const rotation = entityInstance.collider.collider.rotation();
        entityInstance.transform.quaternion[0] = rotation.x;
        entityInstance.transform.quaternion[1] = rotation.y;
        entityInstance.transform.quaternion[2] = rotation.z;
        entityInstance.transform.quaternion[3] = rotation.w;
      },
    };
  });
