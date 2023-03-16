import { Material } from 'cannon-es';
import { Vector3 } from 'three';
import { createCalculatorEstimateVelocityFromPosition } from '../../utils/velocityEstimator';
import { defineComponent, EntityList, EntityWithChildren } from '../core';
import { Entity } from '../entity';
import { EntityCollisionFilterGroup, EntityPhysicsView, GROUP_SELECTABLE, GROUP_SELECTOR } from './physics-view';
import { EntityPhysicsViewBox } from './physics-view-box';
import { EntityPhysicsViewSphere } from './physics-view-sphere';
import { EntityPlayer } from './player';
import { EntitySelector } from './selectable';

export type EntityPlayerPhysicsGloves = EntityWithChildren &
  EntityPlayer & {
    playerPhysicsGloves: {
      [side in `left` | `right`]: {
        joints: {
          [name in XRHandJoint]?: {
            entity: EntityPhysicsViewSphere;
          };
        };
        weapon: EntityPhysicsView[];
      };
    };
  };

export const EntityPlayerPhysicsGloves = defineComponent<EntityPlayerPhysicsGloves>()
  .with(`children`, () => new EntityList())
  .with(`playerPhysicsGloves`, ({ material }: { material?: Material }, e) => {
    const gloves = Object.fromEntries(
      [`left` as const, `right` as const].map((side) => {
        const joints = Object.fromEntries(
          jointNames.map((jointName) => [
            jointName,
            {
              _v: new Vector3(),
              entity: Entity.create(`playerPhysicsGloves:${side}:${jointName}`)
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
            },
          ]),
        );

        const club = Entity.create(`playerPhysicsGloves:${side}:club`)
          .addComponent(EntityPhysicsViewBox, {
            kind: `kinematic`,
            // enablePhysics: true,
            material,
            mass: 0,
            scale: [0.1, 0.1, 1],
            // radius: 0.1,
            debugColorRgba: 0xcc000020,
            startPosition: [1, 1, 1],
            startRotation: [0, 0, 0],
            // linearDamping: 0.99,
          })
          .addComponent(EntityCollisionFilterGroup, {
            group: GROUP_SELECTOR,
            mask: GROUP_SELECTABLE,
          })
          .addComponent(EntitySelector, {})
          .extend((e) => {
            EntitySelector.changeSelectionMode(e, `down`);
          })
          .build();

        // const handOrb = Entity.create(`playerPhysicsGloves:${side}:handOrb`)
        //   .addComponent(EntityPhysicsViewSphere, {
        //     enablePhysics: true,
        //     material,
        //     mass: 0,
        //     radius: 0.1,
        //     debugColorRgba: 0xcc000020,
        //     startPosition: [1, 1, 1],
        //     linearDamping: 0.99,
        //   })
        //   .addComponent(EntityCollisionFilterGroup, {
        //     group: GROUP_SELECTOR,
        //     mask: GROUP_SELECTABLE,
        //   })
        //   .addComponent(EntitySelector, {})
        //   .extend((e) => {
        //     EntitySelector.changeSelectionMode(e, `down`);
        //   })
        //   .build();

        // const handOrbAttachment = Entity.create(`playerPhysicsGloves:${side}:handOrbAttachment`)
        //   .addComponent(EntityPhysicsViewSphere, {
        //     enablePhysics: true,
        //     material,
        //     mass: 20,
        //     radius: 0.1,
        //     debugColorRgba: 0xcc000020,
        //     startPosition: [1, 1, 1],
        //     linearDamping: 0.5,
        //   })
        //   .addComponent(EntityCollisionFilterGroup, {
        //     group: GROUP_SELECTOR,
        //     mask: GROUP_SELECTABLE,
        //   })
        //   .addComponent(EntitySelector, {})
        //   .extend((e) => {
        //     EntitySelector.changeSelectionMode(e, `down`);
        //   })
        //   .build();

        // const handOrbSpring = Entity.create(`playerPhysicsGloves:${side}:handOrbSpring`)
        //   .addComponent(EntityPhysicsConstraintSpring, {
        //     entityA: handOrb as EntityPhysicsView,
        //     entityB: handOrbAttachment as EntityPhysicsView,
        //     options: {
        //       restLength: 0.5,
        //       stiffness: 1000,
        //       damping: 0.3,
        //     },
        //   })
        //   .build();

        const weapon = [
          club, //handOrbAttachment, handOrbSpring
        ] as EntityPhysicsView[];

        return [
          side,
          {
            joints,
            weapon,
            _calculator: createCalculatorEstimateVelocityFromPosition(),
          },
        ];
      }),
    );

    e.children.add(...Object.values(gloves.left.joints).map((x) => x.entity));
    e.children.add(...Object.values(gloves.right.joints).map((x) => x.entity));
    e.children.add(...Object.values(gloves.left.weapon));
    e.children.add(...Object.values(gloves.right.weapon));

    e.frameTrigger.subscribe(() => {
      const g = e.player.gestures;
      if (!g) {
        return;
      }

      [`left` as const, `right` as const].forEach((side) => {
        const { calculate, inTargetPosition, inTargetQuanternion, outVelocity, outAngularVelocity } =
          gloves[side]._calculator;
        inTargetPosition
          .copy(g[side].pointingHand.direction)
          .multiplyScalar(0.5)
          .add(g[side].pointingHand.position)
          .add(e.transform.position);
        inTargetQuanternion.copy(g[side].pointingHand.quaternion);
        calculate({
          inTargetPosition,
          inTargetQuanternion,
          inActualPosition: gloves[side].weapon[0].transform.position,
          inActualQuanternion: gloves[side].weapon[0].transform.quaternion,
          outVelocity,
          outAngularVelocity,
        });

        gloves[side].weapon[0].physics.api.velocity.copy(outVelocity);
        gloves[side].weapon[0].physics.api.angularVelocity.copy(outAngularVelocity);

        // gloves[side].weapon[0].physics.api.position.copy(inTargetPosition);
        // gloves[side].weapon[0].physics.api.quaternion.copy(inTargetQuanternion);

        jointNames.forEach((jointName) => {
          const { entity, _v } = gloves[side]?.joints[jointName] ?? {};
          if (!entity) {
            return;
          }
          const joint = g[side]._joints[jointName];
          if (!joint) {
            return;
          }

          _v.copy(joint.position).add(e.transform.position);
          EntityPhysicsViewSphere.move(entity, _v);
        });
      });
    });

    return {
      ...(gloves as unknown as EntityPlayerPhysicsGloves[`playerPhysicsGloves`]),
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
