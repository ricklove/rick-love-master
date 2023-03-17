import { Triplet } from '@react-three/cannon';
import { Material } from 'cannon-es';
import { filter, map } from 'rxjs';
import { Vector3 } from 'three';
import { randomItem } from '@ricklove/utils-core';
import { ambientSoundFiles, popSoundFiles } from '../assets/sounds';
import { EntityAudioListener, EntityAudioPlayer } from '../entities/components/audio';
import { EntityAdjustToGround, EntityGround } from '../entities/components/ground';
import { EntityGroundView } from '../entities/components/ground-view';
import { EntityHumanoidBody } from '../entities/components/humanoid-body/humanoid-body';
import { EntityHumanoidBodyMoverGroovy } from '../entities/components/humanoid-body/mover-groovy';
import { EntityMouseInput } from '../entities/components/mouse-input';
import { EntityCollisionFilterGroup, GROUP_SELECTABLE, GROUP_SELECTOR } from '../entities/components/physics-view';
import { EntityPhysicsViewBox } from '../entities/components/physics-view-box';
import { EntityPhysicsViewSphere } from '../entities/components/physics-view-sphere';
import { EntityPlayer } from '../entities/components/player';
import { EntityPlayerPhysicsGloves } from '../entities/components/player-physics-gloves';
import { EntitySelectable, EntitySelector } from '../entities/components/selectable';
import { EntityRaycastSelector } from '../entities/components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from '../entities/components/selectable-raycast-selector-collider';
import { Entity, SceneDefinition, SceneMaterialOptions } from '../entities/entity';

export const groundMaterial = new Material(`groundMaterial`);
export const ballMaterial = new Material(`ballMaterial`);
export const handMaterial = new Material(`handMaterial`);
export const humanoidMaterial = new Material(`humanoidMaterial`);

export const materialSettings = [
  {
    a: ballMaterial,
    b: groundMaterial,
    options: {
      friction: 0.3,
      restitution: 0.5,
    },
  },
  {
    a: ballMaterial,
    b: handMaterial,
    options: {
      //explode
      restitution: 100.1,
    },
  },
  {
    a: humanoidMaterial,
    b: handMaterial,
    options: {
      //explode
      restitution: 100.1,
    },
  },
] satisfies SceneMaterialOptions[];

const player = Entity.create(`player`)
  .addComponent(EntityPlayer, {})
  .addComponent(EntityPlayerPhysicsGloves, {
    material: handMaterial,
  })
  // .addComponent(EntityHumanoidBody, { scale: 10, offset: new Vector3(0, 5, 0) })
  .addComponent(EntityAdjustToGround, {
    minGroundHeight: 0,
    maxGroundHeight: 0,
  })
  .extend((p) => {
    p.frameTrigger.subscribe(() => {
      if (!p.player.gestures) {
        return;
      }
      p.transform.position.add(p.player.gestures.body.moving._velocity.clone().multiplyScalar((0.5 * 1) / 60));
    });
  })
  .build();

const ambientMusic = ambientSoundFiles.map((x, i) => ({ key: `ambient-${i}`, url: x }));
const popSounds = popSoundFiles.map((x, i) => ({ key: `pop-${i}`, url: x }));

const audioListener = Entity.create(`audioListener`)
  .addComponent(EntityAudioListener, {
    sounds: Object.fromEntries([...ambientMusic, ...popSounds].map((x) => [x.key, { ...x }])),
  })
  .build();
const audioMusic1 = Entity.create(`audioMusic1`)
  .addComponent(EntityAudioPlayer, { listener: audioListener })
  .extend((e) => {
    const playRandomMusic = () => {
      EntityAudioPlayer.playSound(e, randomItem(ambientMusic).key, {
        soundPositionTarget: player,
        onDone: () => playRandomMusic(),
      });
    };
    playRandomMusic();
  })
  .build();
const audioMusic2 = Entity.create(`audioMusic2`)
  .addComponent(EntityAudioPlayer, { listener: audioListener })
  .extend((e) => {
    setTimeout(() => {
      const playRandomMusic = () => {
        EntityAudioPlayer.playSound(e, randomItem(ambientMusic).key, {
          soundPositionTarget: player,
          onDone: () => playRandomMusic(),
        });
      };
      playRandomMusic();
    }, 10000);
  })
  .build();

const humanoid = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(0, 0, 0), material: humanoidMaterial })
  .build();

const humanoidOffset = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(1, 0, 0), material: humanoidMaterial })
  .build();

const humanoidMovement = Entity.create(`humanoid`)
  .addComponent(EntityHumanoidBody, { scale: 1, offset: new Vector3(1, 0, 0), material: humanoidMaterial })
  .addComponent(EntityHumanoidBodyMoverGroovy, { direction: new Vector3(-1, 0, 1) })
  .build();

const MAX_DISTANCE = 10;
const rows = 2;
const cols = 2;
// const rows = 1;
// const cols = 1;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, {
      scale: 1.5,
      offset: new Vector3(i % rows, 0, Math.floor(i / rows)),
      material: humanoidMaterial,
    })
    .addComponent(EntityHumanoidBodyMoverGroovy, {
      direction: new Vector3(-1, 0, 1),
      speed: 0.5 + 10 * Math.random(),
      yRatio: 2,
    })

    .extend((e) => {
      const sound = Entity.create(`humanoid-sound-${i}`)
        .addComponent(EntityAudioPlayer, { listener: audioListener })
        // .extend((e) => {
        //   setTimeout(() => {
        //     const playRandomMusic = () => {
        //       EntityAudioPlayer.playSound(e, randomItem(ambientMusic).key, () => playRandomMusic(), player);
        //     };
        //     playRandomMusic();
        //   }, 10000);
        // })
        .build();
      e.children.add(sound);

      const posFuture = new Vector3();
      const newDir = new Vector3();

      const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`)!;

      const selectableOffset = new Vector3(0, 0, 0);
      const a = new Vector3(0, 2, 0);
      const selectableHover = Entity.create(`humanoid-selectable-${i}`)
        .addComponent(EntityPhysicsViewBox, {
          mass: 0.0001,
          // scale: [0.25, 0.4, 0.25],
          scale: [0.35, 0.7, 0.35],
          startRotation: [0, 0, 0],
          debugColorRgba: 0x997744ff,
        })
        .addComponent(EntityCollisionFilterGroup, {
          group: GROUP_SELECTABLE,
          mask: GROUP_SELECTOR,
        })
        .addComponent(EntitySelectable, {})
        .extend((selectable) => {
          // physics to selection
          EntitySelectable.subscribeToEvent(
            selectable.physics.collideSubject.pipe(
              filter((x) => !!(x.entity as Entity).selectable && !!(x.other as Entity)?.selector),
              map((x) => ({
                sequence: x.sequence,
                selectable: x.entity as Entity as EntitySelectable,
                selector: x.other as Entity as EntitySelector,
              })),
            ),
          );

          // follow mainPart position
          selectable.frameTrigger.subscribe(() => {
            if (!mainPart?.entity) {
              return;
            }
            selectable.physics.api.velocity.set(0, 0, 0);
            selectable.physics.api.angularVelocity.set(0, 0, 0);
            selectable.physics.api.position.copy(a.copy(mainPart.entity.transform.position).add(selectableOffset));
            selectable.physics.api.quaternion.copy(mainPart.entity.transform.quaternion);
            // logger.log(`selectable`, { a, selectable });
          });

          // handle selection
          let id = setTimeout(() => {
            /**/
          }, 0);
          selectable.selectable.stateSubject
            .pipe(filter((x) => x.mode === `down` && x.sequence === `begin`))
            .subscribe((s) => {
              // add force
              e.humanoidBodyMoverGroovy.enabled = false;
              e.humanoidBody.parts.forEach((p) => {
                EntityAudioPlayer.playSound(sound, randomItem(popSounds).key, {
                  soundPositionTarget: mainPart.entity,
                });
                p.entity.physics.api.velocity.set(
                  5 - 10 * Math.random(),
                  10 * (0.5 + 0.5 * Math.random()),
                  5 - 10 * Math.random(),
                );
              });
              clearTimeout(id);
              id = setTimeout(() => {
                e.humanoidBodyMoverGroovy.enabled = true;
              }, 10 * 1000);
            });
        })
        .build();
      e.children.add(selectableHover);

      mainPart?.entity.frameTrigger.subscribe(() => {
        const pos = mainPart?.entity.transform.position;
        if (!pos) {
          return;
        }

        // Change random direction back towards center if outside zone
        const posLengthSq = pos.lengthSq();
        // logger.log(`change direction ? `, { posLengthSq });

        if (posLengthSq > MAX_DISTANCE * MAX_DISTANCE) {
          // only change direciton is current direction is not back toward center
          const posFutureLengthSq = posFuture
            .copy(e.humanoidBodyMoverGroovy.direction)
            .normalize()
            .multiplyScalar(pos.length())
            .add(pos)
            .lengthSq();
          // logger.log(`change direction ? `, {
          //   c: posFutureLengthSq >= posLengthSq,
          //   posLength: Math.sqrt(posLengthSq),
          //   posFutureLength: Math.sqrt(posFutureLengthSq),
          // });

          if (posFutureLengthSq >= MAX_DISTANCE * MAX_DISTANCE) {
            newDir
              .randomDirection()
              .setY(0)
              .normalize()
              .multiplyScalar(MAX_DISTANCE * 0.5)
              .sub(pos)
              .setY(0)
              .normalize();
            const newSpeed = 0.5 + 10 * Math.random();
            EntityHumanoidBodyMoverGroovy.setMovement(e, newDir, newSpeed);
            // logger.log(`change direction`, { newDir, newSpeed });
          }
        }
      });
    })
    .build(),
);

const ball = Entity.create(`ball`)
  .addComponent(EntityPhysicsViewSphere, {
    material: ballMaterial,
    mass: 1000,
    radius: 2,
    debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
    startPosition: [40, 5, -40],
  })
  .build();

const ball2 = Entity.create(`ball`)
  .addComponent(EntityPhysicsViewSphere, {
    material: ballMaterial,
    mass: 1000,
    radius: 2,
    debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
    startPosition: [-60, 5, -60],
  })
  .build();

const mouseInput = Entity.create(`mouseInput`).addComponent(EntityMouseInput, {}).build();
const mouseRaycastSelector = Entity.create(`mouseRaycastSelector`)
  .addComponent(EntityCollisionFilterGroup, {
    group: GROUP_SELECTOR,
    mask: GROUP_SELECTABLE,
  })
  .addComponent(EntitySelector, {})
  .addComponent(EntityRaycastSelector, {})
  .addComponent(EntityRaycastSelectorCollider, { length: 100 })
  .extend((e) => {
    EntityRaycastSelector.changeSource(e, mouseInput.mouseInput);
    mouseInput.mouseInput.buttonsSubject.pipe(filter((x) => x.kind === `left`)).subscribe((x) => {
      EntitySelector.changeSelectionMode(e, x.sequence === `begin` ? `down` : `hover`);
    });
  })
  .build();

// const ball3 = Entity.create(`ball`)
//   .addComponent(EntityPhysicsViewSphere, {
//     mass: 1000,
//     radius: 1,
//     debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
//     startPosition: [-40, 5, 0],
//   })
//   .build();

// const ball4 = Entity.create(`ball`)
//   .addComponent(EntityPhysicsViewSphere, {
//     mass: 1000,
//     radius: 1,
//     debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
//     startPosition: [0, 5, -30],
//   })
//   .build();

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    material: groundMaterial,
    segmentCount: 16,
    segmentSize: 16,
    // Physics needs ground to have some height
    minHeight: 0,
    maxHeight: 10,
    shape: `bowl`,
  })
  .addComponent(EntityGroundView, {})
  .build();

export const scene02: SceneDefinition = {
  debugPhysics: true,
  iterations: 15,
  rootEntities: [
    audioListener,
    audioMusic1,
    audioMusic2,
    player,
    // humanoid,
    // humanoidOffset,
    // humanoidMovement,
    ...humanoids,
    ground,
    // ball,
    // ball2,
    // mouseInput,
    // mouseRaycastSelector,
    // ball3,
    // ball4,
  ],
  gravity: [0, 0.5 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
