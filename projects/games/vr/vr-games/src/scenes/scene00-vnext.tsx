import { Triplet } from '@react-three/cannon';
import { Material } from 'cannon-es';
import { filter, first, map, throttleTime } from 'rxjs';
import { Vector3 } from 'three';
import { randomItem } from '@ricklove/utils-core';
import { ambientSoundFiles, creatureSoundFiles, popSoundFiles } from '../assets/sounds';
import { EntityAudioListener, EntityAudioPlayer } from '../entities/components/audio';
import { EntityChooser } from '../entities/components/chooser';
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
import { EntityProblemEngine } from '../entities/components/problem-engine';
import { EntitySelectable, EntitySelector } from '../entities/components/selectable';
import { EntityRaycastSelector } from '../entities/components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from '../entities/components/selectable-raycast-selector-collider';
import { EntityTextView } from '../entities/components/text-view';
import { Entity, SceneDefinition, SceneMaterialOptions } from '../entities/entity';
import { logger } from '../utils/logger';

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
const creatureSounds = creatureSoundFiles.map((x, i) => ({ key: `creature-${i}`, url: x }));

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
const rows = 5;
const cols = 1;
// const rows = 1;
// const cols = 1;
const humanoids = [...new Array(rows * cols)].map((_, i) =>
  Entity.create(`humanoid-${i}`)
    .addComponent(EntityHumanoidBody, {
      scale: 1.5,
      offset: new Vector3(i % rows, 0.2, -10 + Math.floor(i / rows)),
      material: humanoidMaterial,
    })
    .addComponent(EntityHumanoidBodyMoverGroovy, {
      direction: new Vector3(-1, 0, 1),
      speed: 0.5 + 10 * Math.random(),
      yRatio: 2,
    })
    .addComponent(EntityPhysicsViewSphere, {
      enablePhysics: false,
      radius: 0.01,
    })
    .addComponent(EntityTextView, {
      defaultText: `*-"*`,
      offset: new Vector3(0, 1, 0),
      color: 0xffffff,
      fontSize: 0.3,
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
      mainPart.entity.frameTrigger.subscribe(() => {
        e.transform.position.copy(mainPart.entity.transform.position);
      });

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
        })
        .build();
      e.children.add(selectableHover);

      mainPart.entity.frameTrigger.subscribe(() => {
        const pos = mainPart.entity.transform.position;

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

// handle selection
const timeoutIds = {} as { [key: string]: NodeJS.Timeout };

const playSoundConfirmSelection = (e: typeof humanoids[0]) => {
  const eSound = e.children.items.find((x) => (x as EntityAudioPlayer).audioPlayer)! as EntityAudioPlayer;
  const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`)!;
  EntityAudioPlayer.playSound(eSound, randomItem(popSounds).key, {
    soundPositionTarget: mainPart.entity,
  });
};

const hitHumaniodUp = (e: typeof humanoids[0]) => {
  const eSound = e.children.items.find((x) => (x as EntityAudioPlayer).audioPlayer)! as EntityAudioPlayer;
  const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`)!;

  // add force
  e.humanoidBodyMoverGroovy.enabled = false;
  e.humanoidBody.parts.forEach((p) => {
    p.entity.physics.api.velocity.set(5 - 10 * Math.random(), 10 * (0.5 + 0.5 * Math.random()), 5 - 10 * Math.random());
  });
  clearTimeout(timeoutIds[e.key]);
  timeoutIds[e.key] = setTimeout(() => {
    e.humanoidBodyMoverGroovy.enabled = true;
    EntityAudioPlayer.playSound(eSound, randomItem(creatureSounds).key, {
      soundPositionTarget: mainPart.entity,
    });
  }, 10 * 1000);
};

const t = new Vector3();
const throwPlayer = (e: typeof player, eHumanoid: typeof humanoids[0]) => {
  // e.adjustToGround.active = false;

  // move towards own weapon for a time
  // const weapon = e.playerPhysicsGloves.right.weapon[0];
  // t.copy(weapon.transform.position).sub(e.transform.position).multiplyScalar(10);
  t.copy(e.transform.position)
    .sub(eHumanoid.humanoidBody.parts.find((x) => x.part === `upper-torso`)!.entity.transform.position)
    .setY(0)
    .normalize()
    .multiplyScalar(5);
  e.transform.position.add(t);

  // const frameSub = e.frameTrigger.subscribe(() => {
  //   t.copy(weapon.transform.position).sub(e.transform.position).multiplyScalar(0.2);
  //   e.transform.position.add(t);
  //   e.transform.quaternion.copy(weapon.transform.quaternion);
  // });

  // clearTimeout(timeoutIds[e.key]);
  // timeoutIds[e.key] = setTimeout(() => {
  //   frameSub.unsubscribe();
  //   e.transform.quaternion.identity();
  //   e.adjustToGround.active = true;
  // }, 5 * 100);
};

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

const problemEngine = Entity.create(`problemEngine`).addComponent(EntityProblemEngine, {}).build();
const problemChooserManager = Entity.create(`problemChooser`)
  .addComponent(EntityChooser, {
    maxChoiceCount: 4,
  })
  .extend((e) => {
    problemEngine.ready.subscribe(() => {
      logger.log(`problemChooserManager problemEngine ready`, {});
      EntityProblemEngine.setChooser(problemEngine, e);

      const subs = [] as { unsubscribe: () => void }[];
      const eChoosers = humanoids;

      const maxChoiceCount = e.chooser.maxChoiceCount;

      let refreshId = setTimeout(() => {
        /**/
      }, 0);
      const reset = () => {
        subs.forEach((x) => x.unsubscribe());
        subs.splice(0, subs.length);
        eChoosers.forEach((b, i) => {
          b.textView.text = ``;
        });
      };

      e.chooser.choicesSubject.subscribe((s) => {
        if (s.event === `none`) {
          return;
        }

        logger.log(`choicesSubject`, { s });
        const DONE = `DONE`;
        const NEXT = `NEXT`;

        const getText = (c: typeof s.choices[number]) => {
          return c.text;
          // return !s.isMultiChoice || c.text === DONE || c.text === NEXT
          //   ? c.text
          //   : `${c.active ? `[x]` : `[ ]`} ${c.text}`;
        };

        if (s.event === `clear`) {
          reset();
          return;
        }
        if (s.event === `new`) {
          reset();
          let iChoice = 0;
          const refreshChoices = () => {
            reset();
            const iChoiceAfter = s.choices.length <= maxChoiceCount ? s.choices.length : iChoice + maxChoiceCount - 1;
            const items = [
              ...s.choices.slice(iChoice, iChoiceAfter),
              ...(iChoiceAfter < s.choices.length
                ? [{ active: false, text: NEXT }]
                : s.isMultiChoice
                ? [{ active: false, text: DONE }]
                : []),
            ];
            items.forEach((c, i) => {
              const b = eChoosers[i];
              const bSelectable = b.children.items.find((x) => (x as EntitySelectable).selectable)! as EntitySelectable;

              // b.active = true;
              b.textView.text = getText(c);
              logger.log(`choice`, { text: b.textView.text });

              const sub = bSelectable.selectable.stateSubject
                .pipe(
                  filter((x) => x.event === `down-begin`),
                  throttleTime(3000),
                )
                .subscribe((x) => {
                  playSoundConfirmSelection(b);

                  if (c.text === NEXT) {
                    hitHumaniodUp(b);
                    iChoice = iChoiceAfter;
                    refreshChoices();
                    return;
                  }
                  if (c.text === DONE) {
                    hitHumaniodUp(b);
                    EntityChooser.submitChoices(e);
                    return;
                  }

                  problemEngine.problemEngine.feedbackSubject.pipe(first()).subscribe(({ wasCorrect }) => {
                    if (wasCorrect) {
                      hitHumaniodUp(b);
                      return;
                    }

                    throwPlayer(player, b);
                  });

                  logger.log(`toggle`, { c });
                  EntityChooser.toggleChoice(e, c);
                  if (!s.isMultiChoice) {
                    EntityChooser.submitChoices(e);
                  }
                });
              subs.push(sub);
            });
          };

          clearTimeout(refreshId);
          refreshId = setTimeout(() => {
            refreshChoices();
          }, 500);
          return;
        }
        // s.choices.forEach((c, i) => {
        //   const b = eChoosers[i];
        //   b.textView.text = getText(c);
        // });
      });
    });
  })
  .build();

export const scene00: SceneDefinition = {
  debugPhysics: true,
  iterations: 15,
  rootEntities: [
    problemEngine,
    problemChooserManager,
    audioListener,
    audioMusic1,
    audioMusic2,
    player,
    // humanoid,
    // humanoidOffset,
    // humanoidMovement,
    ...humanoids,
    ground,
    // mouseInput,
    // mouseRaycastSelector,
  ],
  gravity: [0, 0.5 * -9.8, 0] as Triplet,
  // gravity: [0, 0, 0] as Triplet,
};
