import React, { useState } from 'react';
import { Physics } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { EntityGravity } from './entities/components/gravity';
import { EntityAdjustToGround, EntityGround } from './entities/components/ground';
import { EntityGroundView } from './entities/components/ground-view';
import { EntityPlayer } from './entities/components/player';
import { EntityProblemEngine } from './entities/components/problem-engine';
import { EntitySelectable, EntitySelector } from './entities/components/selectable';
import { EntityRaycastSelector } from './entities/components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from './entities/components/selectable-raycast-selector-collider';
import { EntityRaycastSelectorThree } from './entities/components/selectable-raycast-selector-three';
import { EntitySphereView } from './entities/components/sphere-view';
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
  .addComponent(EntityRaycastSelectorThree, {})
  .build();

// TODO: Gesture component?
// GestureHandler: Gun shoot to select
const handleGestures = (() => {
  const handleHandGesture = (hand: Gestures[`left`], raycastSelector: EntityRaycastSelector, v: Vector3) => {
    if (!hand.pointingIndexFinger.active) {
      return EntitySelector.changeSelectionMode(raycastSelector, `none`);
    }

    const thumbUp = hand.fingerExtendedThumb.active;
    EntityRaycastSelector.changeSource(raycastSelector, {
      position: v.copy(player.transform.position).add(hand.pointingIndexFinger.position),
      direction: hand.pointingIndexFinger.direction,
    });
    EntitySelector.changeSelectionMode(raycastSelector, thumbUp ? `hover` : `down`);
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
  return (
    Entity.create(`ball`)
      .addComponent(EntitySphereView, {
        radius,
        color: 0xffffff * Math.random(),
        startPosition: [50 - 100 * Math.random(), 100 + 100 * Math.random(), 50 - 100 * Math.random()],
      })
      .addComponent(EntitySelectable, {})
      // .addComponent(EntityAdjustToGround, {
      //   minGroundHeight: radius,
      // })
      // .addComponent(EntityGravity, {})
      .build()
  );
});

const world: World = {
  entities: [problemEngine, player, raycastSelectorLeft, raycastSelectorRight, ground, ...balls] as Entity[],
};

export const game = {
  world,
};

const useWorldFilter = <T extends Entity>(filter: (item: Entity) => boolean) => {
  const [activeEntities, setActiveEntities] = useState(world.entities.filter((x) => x.active && filter(x)));

  useFrame(() => {
    const items = world.entities.filter((x) => x.active).filter(filter);
    setActiveEntities((s) => {
      if (s.length !== items.length) {
        return items;
      }
      for (let i = 0; i < items.length; i++) {
        if (s[i] !== items[i]) {
          return items;
        }
      }

      return s;
    });
  });

  return activeEntities as T[];
};

export const WorldContainer = ({}: {}) => {
  const activeViews = useWorldFilter((x) => !!x.view);
  const activeSpheres = useWorldFilter<EntitySphereView>((x) => !!x.sphere);
  const activeSelectables = useWorldFilter<EntitySelectable>((x) => !!x.selectable);
  const activeSelectors = useWorldFilter<EntityRaycastSelector>((x) => !!x.raycastSelector);
  activeSelectors.forEach((e) => EntitySelector.changeTargets(e as EntitySelector, activeSelectables));

  useFrame(() => {
    const active = world.entities.filter((x) => x.active);
    const ground = active.find((x) => x.ground) as EntityGround;
    const selectables = active.filter((x) => x.selectable) as EntitySelectable[];

    handleGestures();

    for (const e of active) {
      if (e.gravity) {
        EntityGravity.fall(e as EntityGravity);
      }
      if (e.adjustToGround) {
        EntityAdjustToGround.adjustToGround(e as EntityAdjustToGround, ground);
      }

      if (e.raycastSelectorThree && e.selector?.mode !== `none`) {
        EntityRaycastSelectorThree.raycast(e as EntityRaycastSelectorThree);
      }
      // if (e.raycastSelectorPhysics && e.raycastSelector?.mode !== `none`) {
      //   EntityRaycastSelectorPhysics.raycast(e as EntityRaycastSelectorPhysics);
      // }
    }
  });

  return (
    <>
      <Physics allowSleep={true} iterations={15} gravity={[0, -9.8, 0]}>
        {activeViews.map((x) => (
          <React.Fragment key={x.key}>{x.view && <x.view.Component entity={x} />}</React.Fragment>
        ))}
        <EntitySphereView.BatchComponent entities={activeSpheres} />
      </Physics>
    </>
  );
};
