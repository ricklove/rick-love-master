import React, { useMemo, useState } from 'react';
import { Physics } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { filter, map } from 'rxjs';
import { Vector3 } from 'three';
import { EntityForce, EntityForceImpulseUp } from './entities/components/force';
import { EntityGravity } from './entities/components/gravity';
import { EntityAdjustToGround, EntityGround } from './entities/components/ground';
import { EntityGroundView } from './entities/components/ground-view';
import { EntityPhysicsViewSphere } from './entities/components/physics-view-sphere';
import { EntityPlayer } from './entities/components/player';
import { EntityProblemEngine } from './entities/components/problem-engine';
import { EntitySelectable, EntitySelector } from './entities/components/selectable';
import { EntityRaycastSelector } from './entities/components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from './entities/components/selectable-raycast-selector-collider';
import { EntityBase } from './entities/core';
import { Entity, World } from './entities/entity';
import { Gestures } from './gestures/gestures';

const problemEngine = Entity.create(`problemEngine`).addComponent(EntityProblemEngine, {}).build();

const player = Entity.create(`player`)
  .addComponent(EntityPlayer, {})
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
  // .addComponent(EntityRaycastSelectorThree, {})
  .build();

// TODO: Gesture component?
// GestureHandler: Gun shoot to select
const handleGestures = (() => {
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

  return () => {
    const g = player.player.gestures;
    if (!g) {
      return;
    }

    handleHandGesture(g.left, raycastSelectorLeft, vLeft);
    handleHandGesture(g.right, raycastSelectorRight, vRight);
  };
})();

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

const balls = [...new Array(100)].map(() => {
  const radius = 3 * Math.random();
  const ball = Entity.create(`ball`)
    .addComponent(EntityPhysicsViewSphere, {
      mass: 1,
      radius,
      debugColor: 0xffffff * Math.random(),
      startPosition: [50 - 100 * Math.random(), 100 + 100 * Math.random(), 50 - 100 * Math.random()],
    })
    .addComponent(EntitySelectable, {})
    .addComponent(EntityForce, {})
    .addComponent(EntityForceImpulseUp, {
      args: { strength: 10 },
      condition: (e: EntitySelectable) =>
        e.selectable.stateSubject.pipe(
          filter((x) => x.event === `downStart` || x.event === `downEnd`),
          map((x) => x.event === `downStart`),
        ),
    })
    // .addComponent(EntityAdjustToGround, {
    //   minGroundHeight: radius,
    // })
    // .addComponent(EntityGravity, {})
    .build();

  //ball.active = false;
  ball.physics.collideSubject.subscribe((x) => {
    EntitySelectable.handleCollideEvent(x.entity as EntityBase as EntitySelectable, x.event);
  });
  return ball;
});

const world: World = {
  entities: [problemEngine, player, raycastSelectorLeft, raycastSelectorRight, ground, ...balls] as Entity[],
};

export const game = {
  world,
};

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

      console.log(`useWorldFilter`, { items, grouped });
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

  const [activeEntities, setActiveEntities] = useState(groupItems(world.entities.filter((x) => x.active && filter(x))));

  useFrame(() => {
    const items = world.entities.filter((x) => x.active).filter(filter);
    setActiveEntities((s) => {
      if (s.items.length !== items.length) {
        return groupItems(items);
      }
      for (let i = 0; i < items.length; i++) {
        if (s.items[i] !== items[i]) {
          return groupItems(items);
        }
      }

      return s;
    });
  });

  return activeEntities;
};

export const WorldContainer = ({}: {}) => {
  const activeViews = useWorldFilter((x) => !!x.view && !x.view.BatchComponent).items;
  const activeBatchViews = useWorldFilter(
    (x) => !!x.view && !!x.view.BatchComponent && !!x.view.batchKey,
    (x) => x.view?.batchKey!,
  ).grouped;
  const activeSelectables = useWorldFilter<EntitySelectable>((x) => !!x.selectable).items;
  const activeSelectors = useWorldFilter<EntityRaycastSelector>((x) => !!x.raycastSelector).items;
  activeSelectors.forEach((e) => EntitySelector.changeTargets(e as EntitySelector, activeSelectables));

  useFrame(() => {
    const active = world.entities.filter((x) => x.active);
    const ground = active.find((x) => x.ground) as EntityGround;

    handleGestures();

    for (const e of active) {
      if (e.transform && !e.transform.position) {
        // Make sure views are ready
        continue;
      }

      if (e.force) {
        EntityForce.applyForces(e as EntityForce);
      }
      if (e.gravity) {
        EntityGravity.fall(e as EntityGravity);
      }
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
  });

  return (
    <>
      <Physics allowSleep={false} iterations={15} gravity={[0, -9.8, 0]}>
        {activeViews.map((x) => (
          <React.Fragment key={x.key}>{x.view && <x.view.Component entity={x} />}</React.Fragment>
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
