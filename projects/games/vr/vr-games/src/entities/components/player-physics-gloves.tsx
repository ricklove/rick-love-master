import { Material } from 'cannon-es';
import { Vector3 } from 'three';
import { defineComponent, EntityList, EntityWithChildren } from '../core';
import { Entity } from '../entity';
import { EntityPhysicsViewSphere } from './physics-view-sphere';
import { EntityPlayer } from './player';

export type EntityPlayerPhysicsGloves = EntityWithChildren &
  EntityPlayer & {
    playerPhysicsGloves: {
      joints: {
        [side in `left` | `right`]: {
          [name in XRHandJoint | `hand-orb`]?: {
            entity: EntityPhysicsViewSphere;
            _v: Vector3;
          };
        };
      };
    };
  };

export const EntityPlayerPhysicsGloves = defineComponent<EntityPlayerPhysicsGloves>()
  .with(`children`, () => new EntityList())
  .with(`playerPhysicsGloves`, ({ material }: { material?: Material }, e) => {
    const joints = { left: {}, right: {} } as {
      [side in `left` | `right`]: {
        [name in XRHandJoint | `hand-orb`]: {
          entity: EntityPhysicsViewSphere;
          _v: Vector3;
        };
      };
    };

    [`left` as const, `right` as const].forEach((side) => {
      jointNames.forEach((jointName) => {
        joints[side][jointName] = {
          _v: new Vector3(),
          entity:
            jointName === `hand-orb`
              ? Entity.create(`playerPhysicsGloves:handOrb`)
                  .addComponent(EntityPhysicsViewSphere, {
                    enablePhysics: true,
                    material,
                    mass: 10,
                    radius: 0.1,
                    debugColorRgba: 0xcc000020,
                    startPosition: [1, 1, 1],
                    linearDamping: 0.99,
                  })
                  .build()
              : Entity.create(`playerPhysicsGloves:${side}:${jointName}`)
                  .addComponent(EntityPhysicsViewSphere, {
                    enablePhysics: false,
                    // jointName === `index-finger-tip` ||
                    // jointName === `thumb-tip` ||
                    // jointName === `index-finger-phalanx-proximal`,
                    // kind: `static`,
                    material,
                    mass: 0,
                    radius: 0.01,
                    debugColorRgba: 0xff0000ff,
                    startPosition: [1, 1, 1],
                  })
                  .build(),
        };
      });
    });

    e.children.add(...Object.values(joints.left).map((x) => x.entity));
    e.children.add(...Object.values(joints.right).map((x) => x.entity));

    e.frameTrigger.subscribe(() => {
      const g = e.player.gestures;
      if (!g) {
        return;
      }

      [`left` as const, `right` as const].forEach((side) => {
        jointNames.forEach((jointName) => {
          const { entity, _v } = joints[side][jointName];
          if (jointName === `hand-orb`) {
            const delta = _v
              .copy(g[side].pointingHand._proximalAverage)
              .add(e.transform.position)
              .sub(entity.transform.position);
            delta.multiplyScalar(10);
            entity.physics.api.applyImpulse(delta.toArray(), entity.transform.position.toArray());
            return;
          }

          const joint = g[side]._joints[jointName];
          if (!joint) {
            return;
          }

          // v.copy(joint.position);
          // jEntity.transform.position
          _v.copy(joint.position).add(e.transform.position);
          EntityPhysicsViewSphere.move(entity, _v);
        });
      });
    });

    return {
      joints,
    };
  });

const jointNames = [
  `hand-orb`,
  `wrist`,
  `thumb-metacarpal`,
  `thumb-phalanx-proximal`,
  `thumb-phalanx-distal`,
  `thumb-tip`,
  `index-finger-metacarpal`,
  `index-finger-phalanx-proximal`,
  `index-finger-phalanx-intermediate`,
  `index-finger-phalanx-distal`,
  `index-finger-tip`,
  `middle-finger-metacarpal`,
  `middle-finger-phalanx-proximal`,
  `middle-finger-phalanx-intermediate`,
  `middle-finger-phalanx-distal`,
  `middle-finger-tip`,
  `ring-finger-metacarpal`,
  `ring-finger-phalanx-proximal`,
  `ring-finger-phalanx-intermediate`,
  `ring-finger-phalanx-distal`,
  `ring-finger-tip`,
  `pinky-finger-metacarpal`,
  `pinky-finger-phalanx-proximal`,
  `pinky-finger-phalanx-intermediate`,
  `pinky-finger-phalanx-distal`,
  `pinky-finger-tip`,
] as (XRHandJoint | `hand-orb`)[];
