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
          [name in XRHandJoint]?: {
            entity: EntityPhysicsViewSphere;
          };
        };
      };
    };
  };

export const EntityPlayerPhysicsGloves = defineComponent<EntityPlayerPhysicsGloves>()
  .with(`children`, () => new EntityList())
  .with(`playerPhysicsGloves`, ({ material }: { material: Material }, e) => {
    const joints = { left: {}, right: {} } as {
      [side in `left` | `right`]: {
        [name in XRHandJoint]: {
          entity: EntityPhysicsViewSphere;
        };
      };
    };

    [`left` as const, `right` as const].forEach((side) => {
      jointNames.forEach((jointName) => {
        joints[side][jointName] = {
          entity: Entity.create(`playerPhysicsGloves:${side}:${jointName}`)
            .addComponent(EntityPhysicsViewSphere, {
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

    const v = new Vector3();
    e.frameTrigger.subscribe(() => {
      const g = e.player.gestures;
      if (!g) {
        return;
      }

      [`left` as const, `right` as const].forEach((side) => {
        jointNames.forEach((jointName) => {
          const jEntity = joints[side][jointName].entity;
          const joint = g[side]._joints[jointName];
          if (!joint) {
            return;
          }

          // v.copy(joint.position);
          v.copy(joint.position).add(e.transform.position);
          jEntity.physics.api.position.copy(v);
          jEntity.physics.api.velocity.set(0, 0, 0);
          jEntity.physics.api.angularVelocity.set(0, 0, 0);
        });
      });
    });

    return {
      joints,
    };
  });

const jointNames = [
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
] as XRHandJoint[];
