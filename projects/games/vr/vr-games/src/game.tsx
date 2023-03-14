import React, { useEffect, useMemo, useState } from 'react';
import { Physics, Triplet } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { BehaviorSubject, delay, filter, map, timer } from 'rxjs';
import { Vector3 } from 'three';
import { EntityChooser } from './entities/components/chooser';
import { EntityForce } from './entities/components/force';
import { EntityAdjustToGround, EntityGround } from './entities/components/ground';
import { EntityGroundView } from './entities/components/ground-view';
import { EntityMouseInput } from './entities/components/mouse-input';
import { EntityPhysicsViewSphere } from './entities/components/physics-view-sphere';
import { EntityPlayer } from './entities/components/player';
import { EntityPlayerBody } from './entities/components/player-body/player-body';
import { EntityProblemEngine } from './entities/components/problem-engine';
import { EntitySelectable, EntitySelector } from './entities/components/selectable';
import { EntityRaycastSelector } from './entities/components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from './entities/components/selectable-raycast-selector-collider';
import { EntitySpawnable } from './entities/components/spawnable';
import { EntitySpawner } from './entities/components/spawner';
import { EntityTextView } from './entities/components/text-view';
import { calculateAllEntities as calculateActiveEntities, EntityList as EntityList } from './entities/core';
import { Entity, World } from './entities/entity';
import { Gestures } from './gestures/gestures';
import { logger } from './utils/logger';

const problemEngine = Entity.create(`problemEngine`).addComponent(EntityProblemEngine, {}).build();

const ballCount = 20;
const problemChooserManager = Entity.create(`problemChooser`)
  .addComponent(EntityChooser, {
    maxChoiceCount: ballCount,
  })
  .extend((e) => {
    const v = new Vector3();
    // delay setup
    timer(3000).subscribe(() => {
      logger.log(`set chooser`, {});
      EntityProblemEngine.setChooser(problemEngine, e);
    });

    const subs = [] as { unsubscribe: () => void }[];
    let balls = [] as ReturnType<typeof createBall>[];
    const reset = () => {
      subs.forEach((x) => x.unsubscribe());
      subs.splice(0, subs.length);
      balls.forEach((b, i) => {
        b.textView.text = ``;
        EntitySpawner.despawn(ballSpawner, b);
        // ballSpawner.despawn(b);
        // b.physics.api.position.set(...getBallRandomStartposition());
        // b.physics.api.velocity.set(0, 0, 0);
      });
      balls = [];
    };
    e.chooser.choicesSubject.subscribe((s) => {
      if (s.event === `none`) {
        return;
      }

      logger.log(`choicesSubject`, { s });
      const DONE = `DONE`;
      const getText = (c: typeof s.choices[number]) => {
        return !s.isMultiChoice || c.text === DONE ? c.text : `${c.active ? `[x]` : `[ ]`} ${c.text}`;
      };

      if (s.event === `clear`) {
        reset();
        return;
      }
      if (s.event === `new`) {
        reset();
        setTimeout(() => {
          const items = [...s.choices, ...(s.isMultiChoice ? [{ active: false, text: DONE }] : [])];
          items.forEach((c, i) => {
            const b = EntitySpawner.spawn(ballSpawner, new Vector3(...getBallRandomStartPosition(10))) as ReturnType<
              typeof createBall
            >;
            balls.push(b);

            // b.active = true;
            b.textView.text = getText(c);
            logger.log(`choice`, { text: b.textView.text });

            const fSub = EntityForce.register(b, new BehaviorSubject(true), (_, api, position) => {
              const [x, y, z] = position;
              // logger.log(`choice pos`, { text: c.text, position });
              const MAX_DIST = 30;
              if (v.set(x, y, z).lengthSq() < MAX_DIST * MAX_DIST) {
                return;
              }
              api.position.set(...getBallRandomStartPosition(10));
              api.velocity.set(0, 0, 0);
            });
            subs.push(fSub);

            const sub = b.selectable.stateSubject.subscribe((x) => {
              if (x.event !== `down-begin`) {
                return;
              }
              if (c.text === DONE) {
                EntityChooser.submitChoices(e);
                return;
              }

              logger.log(`toggle`, { c });
              EntityChooser.toggleChoice(e, c);
              if (!s.isMultiChoice) {
                EntityChooser.submitChoices(e);
              }
            });
            subs.push(sub);
          });
        }, 100);

        return;
      }

      s.choices.forEach((c, i) => {
        const b = balls[i];
        b.textView.text = getText(c);
      });
    });
  })
  .build();

const player = Entity.create(`player`)
  .addComponent(EntityPlayer, {})
  .addComponent(EntityPlayerBody, {})
  .addComponent(EntityAdjustToGround, {
    minGroundHeight: 0,
    maxGroundHeight: 0,
  })
  .build();

const raycastSelectorLeft = Entity.create(`raycastSelectorLeft`)
  .addComponent(EntitySelector, {})
  .addComponent(EntityRaycastSelector, {})
  .addComponent(EntityRaycastSelectorCollider, {})
  .build();
const raycastSelectorRight = Entity.create(`raycastSelectorRight`)
  .addComponent(EntitySelector, {})
  .addComponent(EntityRaycastSelector, {})
  .addComponent(EntityRaycastSelectorCollider, {})
  .build();

// GestureHandler: Gun shoot to select
(() => {
  const handleHandGesture = (hand: Gestures[`left`], raycastSelector: EntityRaycastSelector, v: Vector3) => {
    if (!hand.pointingHand.active) {
      return EntitySelector.changeSelectionMode(raycastSelector, `none`);
    }

    const fist =
      hand.fingerExtendedIndex.state === `closed` &&
      hand.fingerExtendedMiddle.state === `closed` &&
      hand.fingerExtendedRing.state === `closed` &&
      hand.fingerExtendedPinky.state === `closed`;

    EntityRaycastSelector.changeSource(raycastSelector, {
      position: v.copy(player.transform.position).add(hand.pointingHand.position),
      direction: hand.pointingHand.direction,
    });
    EntitySelector.changeSelectionMode(raycastSelector, fist ? `down` : `hover`);
  };

  const vLeft = new Vector3();
  const vRight = new Vector3();

  player.player.gesturesSubject.subscribe((g) => handleHandGesture(g.left, raycastSelectorLeft, vLeft));
  player.player.gesturesSubject.subscribe((g) => handleHandGesture(g.right, raycastSelectorRight, vRight));
})();

const mouseInput = Entity.create(`mouseInput`).addComponent(EntityMouseInput, {}).build();
const mouseRaycastSelector = Entity.create(`mouseRaycastSelector`)
  .addComponent(EntitySelector, {})
  .addComponent(EntityRaycastSelector, {})
  .addComponent(EntityRaycastSelectorCollider, { length: 1000 })
  .extend((e) => {
    EntityRaycastSelector.changeSource(e, mouseInput.mouseInput);
    mouseInput.mouseInput.buttonsSubject.pipe(filter((x) => x.kind === `left`)).subscribe((x) => {
      EntitySelector.changeSelectionMode(e, x.sequence === `begin` ? `down` : `hover`);
    });
  })
  .build();

const ground = Entity.create(`ground`)
  .addComponent(EntityGround, {
    segmentCount: 16,
    segmentSize: 16,
    minHeight: 0,
    maxHeight: 5,
  })
  .addComponent(EntityGroundView, {})
  .build();

// const ball = Entity.create(`ball`)
//   .addComponent(EntitySphereView, {
//     radius: 3,
//     color: 0xff0055,
//     startPosition: [-2, 10, -5],
//   })
//   .addComponent(EntitySelectable, {})
//   .addComponent(EntityAdjustToGround, {
//     minGroundHeight: 10,
//   })
//   .build();

const getBallRandomStartPosition = (distance: number = 100) =>
  [
    distance * (0.5 - 1 * Math.random()),
    5 + distance * (0.25 * Math.random()),
    distance * (0.5 - 1 * Math.random()),
  ] as Triplet;
const createBall = () => {
  const radius = 3 * Math.random();

  const ball = Entity.create(`ball`)
    .addComponent(EntitySpawnable, {
      doSpawn: (e, pos) => {
        const b = e as typeof ball;
        b.ready
          .pipe(
            filter((x) => !!x),
            delay(100),
          )
          .subscribe(() => {
            b.physics.api.position.set(...pos.toArray());
            b.physics.api.velocity.set(0, 0, 0);
          });
      },
    })
    .addComponent(EntityPhysicsViewSphere, {
      mass: 1,
      radius,
      debugColorRgba: ((0xffffff * Math.random()) << 8) + 0xff,
      startPosition: getBallRandomStartPosition(),
    })
    .addComponent(EntitySelectable, {})
    .addComponent(EntityTextView, {
      offset: new Vector3(0, radius + 0.25, 0),
      defaultText: ``,
      fontSize: 1,
    })
    .addComponent(EntityForce, {})
    // .addComponent(EntityForceImpulseUp, {
    //   args: { strength: 10 },
    //   condition: (e: EntitySelectable) =>
    //     e.selectable.stateSubject.pipe(
    //       filter((x) => x.event === `down-begin` || x.event === `down-end`),
    //       map((x) => x.event === `down-begin`),
    //     ),
    // })
    // .addComponent(EntityAdjustToGround, {
    //   minGroundHeight: radius,
    // })
    .extend((entity) => {
      // physics to selection
      EntitySelectable.subscribeToEvent(
        entity.physics.collideSubject.pipe(
          filter((x) => !!(x.entity as Entity).selectable && !!(x.other as Entity)?.selector),
          map((x) => ({
            sequence: x.sequence,
            selectable: x.entity as Entity as EntitySelectable,
            selector: x.other as Entity as EntitySelector,
          })),
        ),
      );

      // ball fell
      EntityForce.register(entity, new BehaviorSubject(true), (_, api, position) => {
        const [x, y, z] = position;
        if (y > -10) {
          return;
        }
        // Redrop
        api.velocity.set(0, 0, 0);
        api.position.set(...getBallRandomStartPosition());
      });

      // // ball collisions
      // EntityForce.register(
      //   entity,
      //   entity.physics.collideSubject.pipe(
      //     filter((x) => x.entity.name === x.other?.name),
      //     map((x) => x.sequence === `begin`),
      //   ),
      //   (_, api, position) => {
      //     // shoot up small
      //     const strength = 1;
      //     api.applyImpulse([0, strength, 0], position);
      //   },
      // );

      // Selection effects
      // EntityForce.register(
      //   entity,
      //   entity.selectable.stateSubject.pipe(
      //     filter((x) => x.mode === `hover`),
      //     map((x) => x.sequence === `continue`),
      //   ),
      //   (_, api, position) => {
      //     // vibrate
      //     const strength = 0.1;
      //     api.applyImpulse([strength * Math.random(), strength * Math.random(), strength * Math.random()], position);
      //   },
      // );
      // EntityForce.register(
      //   entity,
      //   entity.selectable.stateSubject.pipe(
      //     filter((x) => x.mode === `down`),
      //     map((x) => x.sequence === `begin`),
      //   ),
      //   (_, api, position) => {
      //     // shoot up
      //     const strength = 10;
      //     api.applyImpulse([0, strength, 0], position);
      //   },
      // );
    })
    .build();

  // ball.active = false;
  return ball;
};

const ballSpawner = Entity.create(`ballSpawner`)
  .addComponent(EntitySpawner, {
    createSpawnable: createBall,
  })
  .build();

const world: World = {
  active: new BehaviorSubject(true),
  ready: new BehaviorSubject(true),
  key: `world`,
  name: `world`,
  children: new EntityList([
    player,
    mouseInput,
    mouseRaycastSelector,
    problemEngine,
    problemChooserManager,
    raycastSelectorLeft,
    raycastSelectorRight,
    ground,
    ballSpawner,
  ] as Entity[]),
};

export const game = {
  world,
  activeEntities: calculateActiveEntities<Entity>(world),
};

// const allEntities = world.children.pipe(map(c=>{

//   c.filter(x=>x.active)

// })))

const useWorldFilter = <T extends Entity>(filter: (item: Entity) => boolean, groupKey?: (item: Entity) => string) => {
  const groupItems = useMemo(
    () => (items: Entity[]) => {
      const grouped = !groupKey
        ? { items }
        : items.reduce((out, x) => {
            const k = groupKey(x);
            (out[k] ?? (out[k] = [])).push(x);
            return out;
          }, {} as { [key: string]: Entity[] });

      // if (groupKey) {
      //   console.log(`useWorldFilter`, { items, grouped });
      // }
      return {
        items: items as T[],
        grouped: [
          ...Object.entries(grouped).map(([k, v]) => ({
            key: k,
            first: v[0] as T,
            items: v as T[],
          })),
        ],
      };
    },
    [],
  );

  const [activeEntities, setActiveEntities] = useState(
    groupItems(game.activeEntities.items.filter((x) => x.active && filter(x))),
  );

  useEffect(() => {
    const sub = game.activeEntities.itemsSubject.subscribe((a) => {
      const filtered = groupItems(game.activeEntities.items.filter((x) => x.active && filter(x)));
      setActiveEntities(filtered);

      logger.log(`useWorldFilter updated`, {
        items: a.length,
        filtered: filtered.items.length,
      });
    });
    return () => sub.unsubscribe();
  }, []);

  // useFrame(() => {
  //   const items = world.entities.filter((x) => x.active).filter(filter);
  //   setActiveEntities((s) => {
  //     if (s.items.length !== items.length) {
  //       return groupItems(items);
  //     }
  //     for (let i = 0; i < items.length; i++) {
  //       if (s.items[i] !== items[i]) {
  //         return groupItems(items);
  //       }
  //     }

  //     return s;
  //   });
  // });

  return activeEntities;
};

export const WorldContainer = ({}: {}) => {
  const activeViews = useWorldFilter((x) => !!x.view && !x.view.BatchComponent).items;
  const activeTextViews = useWorldFilter((x) => !!x.textView).items;
  const activeBatchViews = useWorldFilter(
    (x) => !!x.view && !!x.view.BatchComponent && !!x.view.batchKey,
    (x) => x.view?.batchKey!,
  ).grouped;
  // const activeSelectables = useWorldFilter<EntitySelectable>((x) => !!x.selectable).items;
  // const activeSelectors = useWorldFilter<EntityRaycastSelector>((x) => !!x.raycastSelector).items;
  // activeSelectors.forEach((e) => EntitySelector.changeTargets(e as EntitySelector, activeSelectables));

  useFrame(() => {
    // logger.log(`WorldContainer useFrame`, {
    //   entitiesCount: game.activeEntities.items.length,
    //   worldChildrenCount: world.children.items.length,
    // });

    EntityPlayer.updateInput(player);

    const active = game.activeEntities.items;
    const ground = active.find((x) => x.ground) as EntityGround;

    for (const e of active) {
      if (e.transform && !e.transform.position) {
        // Make sure views are ready
        continue;
      }

      if (e.force) {
        EntityForce.applyForces(e as EntityForce);
      }
      // if (e.gravity) {
      //   EntityGravity.fall(e as EntityGravity);
      // }
      if (e.adjustToGround) {
        EntityAdjustToGround.adjustToGround(e as EntityAdjustToGround, ground);
      }

      // if (e.raycastSelectorThree && e.selector?.mode !== `none`) {
      //   EntityRaycastSelectorThree.raycast(e as EntityRaycastSelectorThree);
      // }
      // if (e.raycastSelectorPhysics && e.raycastSelector?.mode !== `none`) {
      //   EntityRaycastSelectorPhysics.raycast(e as EntityRaycastSelectorPhysics);
      // }
    }

    game.activeEntities.frozen = false;
    game.activeEntities.frozen = true;
  });

  logger.log(`WorldContainer RENDER`, {
    entitiesCount: game.activeEntities.items.map((x) => x.key),
    worldChildrenCount: world.children.items.map((x) => x.key),
    activeViews: activeViews.map((x) => x.key),
    activeTextViews: activeTextViews.map((x) => x.key),
    activeBatchViews: activeBatchViews.map((x) => x.key),
  });

  return (
    <>
      <Physics allowSleep={false} iterations={15} gravity={[0, -9.8, 0]}>
        {activeViews.map((x) => (
          <React.Fragment key={x.key}>{x.view && <x.view.Component entity={x} />}</React.Fragment>
        ))}
        {activeTextViews.map((x) => (
          <React.Fragment key={x.key}>{x.textView && <x.textView.Component entity={x} />}</React.Fragment>
        ))}
        {activeBatchViews.map((g) => (
          <React.Fragment key={g.key}>
            {g.first.view?.BatchComponent && <g.first.view.BatchComponent entities={g.items} />}
          </React.Fragment>
        ))}
      </Physics>
    </>
  );
};
