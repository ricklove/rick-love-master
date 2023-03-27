import { RigidBodyType } from '@dimforge/rapier3d-compat';
import { Euler, Vector3 } from 'three';
import { GameEngine, GameWorkerEngine } from '../core/worker/types';
import { wogger } from '../core/worker/wogger';

export const createGame_PunchDefense = ({
  engine: { createEntity, setGravity },
}: {
  engine: GameWorkerEngine;
}): GameEngine => {
  setGravity(new Vector3(0, -9.8, 0));

  const entities = {
    ground: createEntity({
      type: `ground` as const,
      shape: `box` as const,
      kind: `fixed` as const,
      position: new Vector3(0, 0, 0),
      scale: new Vector3(1000, 1, 1000),
      restitution: 1.0,
    }),
    enemies: [...Array(100)]
      .map((_, i) => ({
        type: `enemy` as const,
        active: false,
        shape: `sphere` as const,
        position: new Vector3(0, -1000, 0),
        radius: 0.5,
        collisionEvents: true,
        restitution: 1.0,
        userData: {
          coolDown: 0,
        },
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
        sensor: true,
        gravityScale: 0,
        userData: {
          launchingFromHand: false as false | `left` | `right`,
          coolDown: 0,
        },
      }))
      .map(createEntity),
  };

  const v = new Vector3();
  const v2 = new Vector3();
  const v3 = new Vector3();
  const e = new Euler();

  [...entities.enemies, ...entities.bullets]
    .filter((x) => !x.active)
    .forEach((enemy) => {
      enemy.physics.rigidBody.setBodyType(RigidBodyType.Fixed, true);
      enemy.physics.rigidBody.setLinvel(v3.set(0, 0, 0), false);
      enemy.physics.rigidBody.setAngvel(v3.set(0, 0, 0), false);
    });

  const handData = {
    left: {
      lastPosition: new Vector3(),
    },
    right: {
      lastPosition: new Vector3(),
    },
  };

  const entityHandleMap = new Map(
    [...entities.bullets, ...entities.enemies].map((x) => [x.physics.rigidBody.handle, x]),
  );

  const hideEntity = (entity: ReturnType<typeof createEntity>) => {
    const time = performance.now();
    entity.physics.rigidBody.setBodyType(RigidBodyType.KinematicPositionBased, false);
    entity.physics.rigidBody.setTranslation(new Vector3(0, -1000, 0), false);
    entity.userData.coolDown = time + 1000;
    entity.active = false;

    // wogger.log(`hide entity`, { entity: entity.physics.rigidBody.translation() });
  };

  const update: GameEngine[`update`] = (deltaTimeSec, player, eventQueue) => {
    const time = performance.now();
    const { origin } = player;

    // wogger.log(`update`, { deltaTimeSec, time, entities });

    // Spawn enemies
    const activeEnemies = entities.enemies.filter((x) => x.active);

    if (activeEnemies.length < 10) {
      wogger.log(`spawn enemy`, { enemies: activeEnemies });

      const enemy = entities.enemies.find((x) => !x.active);
      if (enemy) {
        // spawn enemy in random position around player at far distance
        const distance = 5 + 10 * Math.random();
        v.set(0, 0, -distance)
          .applyEuler(e.set(0, Math.random() * 2 * Math.PI, 0))
          .setY(2 + Math.random() * 2)
          .add(origin.position);
        enemy.physics.rigidBody.setTranslation(v, true);
        enemy.physics.rigidBody.setLinvel(v3.set(0, 0, 0), true);
        enemy.active = true;
        enemy.physics.rigidBody.setBodyType(RigidBodyType.Dynamic, true);

        wogger.log(`enemy spwan pos`, { enemy: enemy.physics.rigidBody.translation() });
      }
    }

    // move enemies towards player origin
    activeEnemies.forEach((enemy) => {
      const enemyTranslation = enemy.physics.rigidBody.translation();
      const enemyPosition = v.set(enemyTranslation.x, enemyTranslation.y, enemyTranslation.z);
      const enemyToPlayer = v2
        .copy(origin.position)
        .add(v3.set(Math.random(), 0.5 + Math.random(), Math.random()))
        .sub(enemyPosition);

      if (enemyToPlayer.lengthSq() < 2) {
        return;
      }
      //   const enemyLinearVelocity = enemy.physics.rigidBody.linvel();
      //   const enemyVelocity = v3.set(enemyLinearVelocity.x, enemyLinearVelocity.y, enemyLinearVelocity.z);

      const enemyToPlayerImpulse = v
        .copy(enemyToPlayer)
        .normalize()
        .multiplyScalar(1 * deltaTimeSec);

      enemy.physics.rigidBody.applyImpulse(enemyToPlayerImpulse, true);

      //   wogger.log(`enemy moving towards player`, { enemy: enemy.physics.rigidBody.translation() });
    });

    // shoot bullets from player hands
    const { hands } = player;
    [hands.left, hands.right].forEach((hand) => {
      const handVelocity = v
        .copy(hand.position)
        .sub(handData[hand.side].lastPosition)
        .multiplyScalar(1 / deltaTimeSec);
      handData[hand.side].lastPosition.copy(hand.position);

      const handDirectionFromOrigin = v2.copy(hand.position).sub(origin.position).normalize();
      const handSpeedFromOrigin = handVelocity.dot(handDirectionFromOrigin);

      // if hand is moving forward
      if (handSpeedFromOrigin > 1) {
        const attachedBullet = entities.bullets.find((x) => x.active && x.userData.launchingFromHand === hand.side);

        // attach bullet to hand
        if (!attachedBullet) {
          const bullet = entities.bullets.find((x) => !x.active && x.userData.coolDown < time);
          if (bullet) {
            bullet.userData.launchingFromHand = hand.side;
            bullet.physics.rigidBody.setTranslation(hand.position, true);
            bullet.physics.rigidBody.setLinvel(v.set(0, 0, 0), true);
            bullet.active = true;
            bullet.physics.rigidBody.setBodyType(RigidBodyType.Dynamic, true);
          }
        }

        // apply impulse to keep bullet attached to hand
        if (attachedBullet) {
          const bulletTranslation = attachedBullet.physics.rigidBody.translation();
          const bulletPosition = v.set(bulletTranslation.x, bulletTranslation.y, bulletTranslation.z);
          const deltaToHand = v2
            .copy(hand.position)
            .sub(bulletPosition)
            .multiplyScalar(1 * deltaTimeSec);
          attachedBullet.physics.rigidBody.applyImpulse(deltaToHand, true);
        }
      }

      //   wogger.log(`hand speed`, { handSpeedFromOrigin });
      // if hand is moving backward
      if (handSpeedFromOrigin < 0) {
        // detach bullet from hand
        const attachedBullet = entities.bullets.find((x) => x.userData.launchingFromHand === hand.side);
        if (attachedBullet) {
          attachedBullet.userData.launchingFromHand = false;
        }
      }
    });

    entities.bullets
      .filter((x) => x.active)
      .forEach((bullet) => {
        // if too far, remove bullet
        const bulletTranslation = bullet.physics.rigidBody.translation();
        const bulletPosition = v.set(bulletTranslation.x, bulletTranslation.y, bulletTranslation.z);
        const distanceFromOriginSq = v2.copy(bulletPosition).sub(origin.position).lengthSq();
        if (distanceFromOriginSq > 10000) {
          hideEntity(bullet);
        }
      });

    // TEMP: collisions is not working, so just check distance between bullet and enemy
    // if bullet hits enemy, remove both
    entities.bullets
      .filter((x) => x.active)
      .forEach((bullet) => {
        entities.enemies
          .filter((x) => x.active)
          .forEach((enemy) => {
            const bulletTranslation = bullet.physics.rigidBody.translation();
            const bulletPosition = v.set(bulletTranslation.x, bulletTranslation.y, bulletTranslation.z);
            const enemyTranslation = enemy.physics.rigidBody.translation();
            const enemyPosition = v2.set(enemyTranslation.x, enemyTranslation.y, enemyTranslation.z);
            const distanceBetweenSq = v3.copy(bulletPosition).sub(enemyPosition).lengthSq();
            const radiusCombined = (bullet.args.radius ?? 0.5) + (enemy.args.radius ?? 0.5) + 0.1;

            if (distanceBetweenSq < radiusCombined * radiusCombined) {
              hideEntity(bullet);
              hideEntity(enemy);
            }
          });
      });

    // handle collisions
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      if (!started) {
        return;
      }

      wogger.log(`collision`, { handle1, handle2 });

      const entity1 = entityHandleMap.get(handle1);
      const entity2 = entityHandleMap.get(handle2);
      if (!entity1 || !entity2) return;
      if (!entity1.active || !entity2.active) return;

      if (
        (entity1.type === `bullet` && entity2.type === `enemy`) ||
        (entity1.type === `enemy` && entity2.type === `bullet`)
      ) {
        hideEntity(entity1);
        hideEntity(entity2);
      }
    });
  };

  return { update };
};
