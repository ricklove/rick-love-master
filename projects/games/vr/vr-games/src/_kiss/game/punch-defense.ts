import { RigidBodyType } from '@dimforge/rapier3d-compat';
import { Euler, Vector3 } from 'three';
import { GameEngine, GameWorkerEngine } from '../core/worker/types';

export const createGame_PunchDefense = ({ engine: { createEntity } }: { engine: GameWorkerEngine }): GameEngine => {
  const entities = {
    ground: createEntity({
      type: `ground` as const,
      shape: `box` as const,
      kind: `fixed` as const,
      position: new Vector3(0, 0, 0),
      scale: new Vector3(1000, 1, 1000),
    }),
    enemies: [...Array(100)]
      .map((_, i) => ({
        type: `enemy` as const,
        active: false,
        shape: `sphere` as const,
        position: new Vector3(0, -1000, 0),
        radius: 0.5,
        collisionEvents: true,
      }))
      .map(createEntity),
    bullets: [...Array(100)]
      .map((_, i) => ({
        type: `bullet` as const,
        active: false,
        shape: `sphere` as const,
        position: new Vector3(0, -1000, 0),
        radius: 0.1,
        collisionEvents: true,
        userData: {
          launchingFromHand: false as false | `left` | `right`,
        },
      }))
      .map(createEntity),
  };

  const handData = {
    left: {
      lastPosition: new Vector3(),
    },
    right: {
      lastPosition: new Vector3(),
    },
  };

  const entityMap = new Map([...entities.bullets, ...entities.enemies].map((x) => [x.id, x]));

  const v = new Vector3();
  const v2 = new Vector3();
  const e = new Euler();
  const update: GameEngine[`update`] = (deltaTimeSec, player, eventQueue) => {
    const { origin } = player;

    // Spawn enemies
    const enemies = entities.enemies.filter((x) => x.active);
    if (enemies.length < 10) {
      const enemy = entities.enemies.find((x) => !x.active);
      if (enemy) {
        // spawn enemy in random position around player at far distance
        const distance = 10;
        v.set(distance, 0, 0)
          .applyEuler(
            e.set(Math.random() * 2 * Math.PI, (Math.random() * 0.35 + 0.15) * Math.PI, Math.random() * 2 * Math.PI),
          )
          .add(origin.position);
        enemy.rigidBody.setTranslation(v, true);
        enemy.active = true;
        enemy.rigidBody.setBodyType(RigidBodyType.Dynamic, true);
      }
    }

    // move enemies towards player origin
    enemies.forEach((enemy) => {
      const enemyTranslation = enemy.rigidBody.translation();
      v.set(enemyTranslation.x, enemyTranslation.y, enemyTranslation.z);
      v2.copy(origin.position)
        .sub(v)
        .normalize()
        .multiplyScalar(10 * deltaTimeSec);
      enemy.rigidBody.applyImpulse(v, true);
    });

    // shoot bullets from player hands
    const { hands } = player;
    [hands.left, hands.right].forEach((hand) => {
      const handVelocity = v
        .copy(hand.position)
        .sub(handData[hand.side].lastPosition)
        .multiplyScalar(1 / deltaTimeSec);
      const handDirectionFromOrigin = v2.copy(hand.position).sub(origin.position).normalize();
      const handSpeedFromOrigin = handVelocity.dot(handDirectionFromOrigin);

      // if hand is moving forward
      if (handSpeedFromOrigin > 1) {
        const attachedBullet = entities.bullets.find((x) => x.userData.launchingFromHand === hand.side);

        // attach bullet to hand
        if (!attachedBullet) {
          const bullet = entities.bullets.find((x) => !x.active);
          if (bullet) {
            bullet.userData.launchingFromHand = hand.side;
            bullet.rigidBody.setTranslation(hand.position, true);
            bullet.active = true;
            bullet.rigidBody.setBodyType(RigidBodyType.Dynamic, true);
          }
        }

        // apply impulse to keep bullet attached to hand
        if (attachedBullet) {
          const bulletTranslation = attachedBullet.rigidBody.translation();
          const bulletPosition = v.set(bulletTranslation.x, bulletTranslation.y, bulletTranslation.z);
          const deltaToHand = v2.copy(hand.position).sub(bulletPosition);
          attachedBullet.rigidBody.applyImpulse(deltaToHand, true);
        }
      }

      // if hand is moving backward
      if (handSpeedFromOrigin < 0) {
        // detach bullet from hand
        const attachedBullet = entities.bullets.find((x) => x.userData.launchingFromHand === hand.side);
        if (attachedBullet) {
          attachedBullet.userData.launchingFromHand = false;
        }
      }
    });

    // handle collisions
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) {
        return;
      }

      const entity1 = entityMap.get(handle1);
      const entity2 = entityMap.get(handle2);
      if (!entity1 || !entity2) return;

      if (entity1.type === `bullet` && entity2.type === `enemy`) {
        entity1.rigidBody.setBodyType(RigidBodyType.Fixed, false);
        entity2.rigidBody.setBodyType(RigidBodyType.Fixed, false);
        entity1.rigidBody.setTranslation(new Vector3(0, -1000, 0), false);
        entity2.rigidBody.setTranslation(new Vector3(0, -1000, 0), false);
        entity1.active = false;
        entity2.active = false;
      }
    });
  };

  return { update };
};
