import { Material } from 'cannon-es';
import { Vector3 } from 'three';
import { defineComponent, EntityList, EntityWithChildren } from '../core';
import { Entity } from '../entity';
import { EntityPhysicsConstraintSpring } from './physics-constraint';
import { EntityPhysicsView } from './physics-view';
import { EntityPhysicsViewSphere } from './physics-view-sphere';
import { EntityPlayer } from './player';

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

        const handOrb = Entity.create(`playerPhysicsGloves:${side}:handOrb`)
          .addComponent(EntityPhysicsViewSphere, {
            enablePhysics: true,
            material,
            mass: 0,
            radius: 0.01,
            debugColorRgba: 0xcc000020,
            startPosition: [1, 1, 1],
            linearDamping: 0.99,
          })
          .build();

        const handOrbAttachment = Entity.create(`playerPhysicsGloves:${side}:handOrbAttachment`)
          .addComponent(EntityPhysicsViewSphere, {
            enablePhysics: true,
            material,
            mass: 50,
            radius: 0.1,
            debugColorRgba: 0xcc000020,
            startPosition: [1, 1, 1],
            linearDamping: 0.7,
          })
          .build();

        const handOrbSpring = Entity.create(`playerPhysicsGloves:${side}:handOrbSpring`)
          .addComponent(EntityPhysicsConstraintSpring, {
            entityA: handOrb as EntityPhysicsView,
            entityB: handOrbAttachment as EntityPhysicsView,
            options: {
              restLength: 0.25,
              stiffness: 5000,
              damping: 0.3,
            },
          })
          .build();

        const weapon = [handOrb, handOrbAttachment, handOrbSpring] as EntityPhysicsView[];

        return [
          side,
          {
            joints,
            weapon,
            _w: new Vector3(),
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
        gloves[side]._w.set(0, 0.25, 0).add(g[side].pointingHand._proximalAverage).add(e.transform.position);
        gloves[side].weapon[0].physics.api.position.copy(gloves[side]._w);

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
