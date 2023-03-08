import React from 'react';
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
  .addComponent(EntityRaycastSelector, {})
  .build();

// GestureHandler: Gun shoot to select
const handleGestures = (() => {
  const v = new Vector3();
  const handleHandGesture = (hand: Gestures[`left`]) => {
    if (!hand.pointingIndexFinger.active) {
      return false;
    }

    const thumbUp = hand.fingerExtendedThumb.active;
    EntityRaycastSelector.changeSource(player, {
      position: v.copy(player.transform.position).add(hand.pointingIndexFinger.position),
      direction: hand.pointingIndexFinger.direction,
    });
    EntityRaycastSelector.changeSelectionMode(player, thumbUp ? `hover` : `down`);
    return true;
  };

  return () => {
    const g = player.player.gestures;
    if (!g) {
      return;
    }
    const wasHandled = handleHandGesture(g.left) || handleHandGesture(g.right) || false;

    if (!wasHandled) {
      EntityRaycastSelector.changeSelectionMode(player, `none`);
    }
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
  entities: [problemEngine, player, ground, ...balls],
};

export const game = {
  world,
};

export const WorldContainer = ({}: {}) => {
  useFrame(() => {
    const active = world.entities.filter((x) => x.active);
    const ground = active.find((x) => x.ground) as EntityGround;
    const selectables = active.filter((x) => x.selectable) as EntitySelectable[];

    handleGestures();

    for (const e of world.entities) {
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
        {world.entities.map((x) => (
          <React.Fragment key={x.key}>{x.active && x.view && <x.view.Component entity={x} />}</React.Fragment>
        ))}
        <EntitySphereView.BatchComponent
          entities={world.entities.filter((x) => x.sphere).map((x) => x as EntitySphereView)}
        />
      </Physics>
    </>
  );
};
