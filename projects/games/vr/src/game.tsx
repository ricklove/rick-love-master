import React, { useState } from 'react';
import { Physics } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { EntityGravity } from './entities/components/gravity';
import { EntityAdjustToGround, EntityGround } from './entities/components/ground';
import { EntityGroundView } from './entities/components/ground-view';
import { EntityPlayer } from './entities/components/player';
import { EntityProblemEngine } from './entities/components/problem-engine';
import { EntityRaycastSelector, EntitySelectable } from './entities/components/selectable';
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

const raycastSelectorLeft = Entity.create(`raycastSelector`).addComponent(EntityRaycastSelector, {}).build();
const raycastSelectorRight = Entity.create(`raycastSelector`).addComponent(EntityRaycastSelector, {}).build();

// GestureHandler: Gun shoot to select
const handleGestures = (() => {
  const handleHandGesture = (hand: Gestures[`left`], raycastSelector: typeof raycastSelectorLeft, v: Vector3) => {
    if (!hand.pointingIndexFinger.active) {
      return EntityRaycastSelector.changeSelectionMode(raycastSelector, `none`);
    }

    const thumbUp = hand.fingerExtendedThumb.active;
    EntityRaycastSelector.changeSource(raycastSelector, {
      position: v.copy(player.transform.position).add(hand.pointingIndexFinger.position),
      direction: hand.pointingIndexFinger.direction,
    });
    EntityRaycastSelector.changeSelectionMode(raycastSelector, thumbUp ? `hover` : `down`);
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
  const [activeEntities, setActiveEntities] = useState(world.entities.filter((x) => x.active).filter(filter));

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
      if (e.raycastSelector && e.raycastSelector.mode !== `none`) {
        EntityRaycastSelector.raycast(e as EntityRaycastSelector, selectables);
      }
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
