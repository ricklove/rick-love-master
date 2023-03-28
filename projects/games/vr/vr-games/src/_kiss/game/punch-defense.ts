import { RigidBodyType } from '@dimforge/rapier3d-compat';
import { Euler, Vector3 } from 'three';
import { GameEngine, GameWorkerEngine } from '../core/worker/types';
import { wogger } from '../core/worker/wogger';

export const createGame_PunchDefense = ({
  engine: { createEntity, setGravity },
}: {
  engine: GameWorkerEngine;
}): GameEngine => {
  //   setGravity(new Vector3(0, -9.8, 0));
  setGravity(new Vector3(0, 0, 0));

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
          targetOffset: new Vector3(),
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
          launchSpeed: 0,
          launchStage: LaunchStage.none,
          launchPositions: [...new Array(100)].map(() => new Vector3()),
          iLaunchHistory: 0,
          launchHistoryCount: 0,
          coolDown: 0,
        },
      }))
      .map(createEntity),
    debugMarkers: [
      { type: `debugHead` as const, size: 0.1, color: 0xff00ff },
      { type: `debugR` as const, size: 0.01, color: 0xff0000 },
      { type: `debugG` as const, size: 0.008, color: 0x00ff00 },
      { type: `debugB` as const, size: 0.01, color: 0x0000ff },
    ].flatMap(({ type, color, size }) =>
      [...Array(100)]
        .map((_, i) => ({
          type,
          active: false,
          shape: `sphere` as const,
          position: new Vector3(0, -1000, 0),
          radius: size,
          sensor: true,
          gravityScale: 0,
          userData: {
            markedAt: 0,
          },
          color,
        }))
        .map(createEntity),
    ),
  };

  const minBulletAttachSpeed = 0.8;
  const minBulletLaunchSpeed = 1.2;
  enum LaunchStage {
    none = 0,
    _01originating,
    _02accelerating,
    _03continuing,
    _04launching,
  }

  const w = {
    v: new Vector3(),
    e: new Euler(),
    handPositionDelta: new Vector3(),
    handVelocity: new Vector3(),
    handDirectionFromPlayerCore: new Vector3(),
    enemyPosition: new Vector3(),
    enemyVelocity: new Vector3(),
    enemyToPlayer: new Vector3(),
    enemyToPlayerImpulse: new Vector3(),
    bulletPosition: new Vector3(),
    bulletVelocity: new Vector3(),
    bulletDiffFromOrigin: new Vector3(),
    bulletLaunchVector: new Vector3(),
  };

  const addDebugMarker = (type: typeof entities.debugMarkers[number][`type`], position: Vector3, time: number) => {
    const markersOfType = entities.debugMarkers.filter((x) => x.type === type);
    const marker =
      markersOfType.find((x) => !x.active) ??
      markersOfType.sort((a, b) => a.userData.markedAt - b.userData.markedAt)[0];
    if (!marker) {
      return;
    }
    marker.physics.rigidBody.setBodyType(RigidBodyType.KinematicPositionBased, true);
    marker.physics.rigidBody.setTranslation(position, true);
    marker.active = true;
    marker.userData.markedAt = time;
  };

  [...entities.enemies, ...entities.bullets]
    .filter((x) => !x.active)
    .forEach((enemy) => {
      enemy.physics.rigidBody.setBodyType(RigidBodyType.Fixed, true);
      enemy.physics.rigidBody.setLinvel(w.v.set(0, 0, 0), false);
      enemy.physics.rigidBody.setAngvel(w.v.set(0, 0, 0), false);
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

  let frameCount = 0;
  const update: GameEngine[`update`] = (deltaTimeSec, player, eventQueue) => {
    frameCount++;
    const time = performance.now();

    // wogger.log(`update`, { deltaTimeSec, time, entities });

    // Spawn enemies
    const activeEnemies = entities.enemies.filter((x) => x.active);

    if (activeEnemies.length < 10) {
      wogger.log(`spawn enemy`, { enemies: activeEnemies });

      const enemy = entities.enemies.find((x) => !x.active);
      if (enemy) {
        // spawn enemy in random position around player at far distance
        const distance = 10 + 20 * Math.random();
        const enemyPosition = w.enemyPosition
          .set(0, 0, -distance)
          .applyEuler(w.e.set(0, Math.random() * 2 * Math.PI, 0))
          .setY(2 + Math.random() * 2)
          .add(player.head.position);
        const enemyVelocity = w.enemyVelocity.set(Math.random(), Math.random(), Math.random());
        enemy.physics.rigidBody.setTranslation(enemyPosition, true);
        enemy.physics.rigidBody.setLinvel(enemyVelocity, true);
        enemy.active = true;
        enemy.physics.rigidBody.setBodyType(RigidBodyType.Dynamic, true);

        enemy.userData.targetOffset.set(Math.random(), 0.5 + Math.random(), Math.random());

        wogger.log(`enemy spwan pos`, { enemy: enemy.physics.rigidBody.translation() });
      }
    }

    // move enemies towards target
    activeEnemies.forEach((enemy) => {
      const enemyTranslation = enemy.physics.rigidBody.translation();
      const enemyPosition = w.enemyPosition.set(enemyTranslation.x, enemyTranslation.y, enemyTranslation.z);
      const enemyToPlayer = w.enemyToPlayer
        .copy(player.head.position)
        .add(enemy.userData.targetOffset)
        .sub(enemyPosition);

      if (enemyToPlayer.lengthSq() < 2) {
        return;
      }
      //   const enemyLinearVelocity = enemy.physics.rigidBody.linvel();
      //   const enemyVelocity = v3.set(enemyLinearVelocity.x, enemyLinearVelocity.y, enemyLinearVelocity.z);

      const enemyToPlayerImpulse = w.enemyToPlayerImpulse
        .copy(enemyToPlayer)
        .normalize()
        .multiplyScalar(1 * deltaTimeSec);

      enemy.physics.rigidBody.applyImpulse(enemyToPlayerImpulse, true);

      //   wogger.log(`enemy moving towards player`, { enemy: enemy.physics.rigidBody.translation() });
    });

    // if (frameCount % 10 === 0) {
    //   addDebugMarker(
    //     `debugHead`,
    //     w.v
    //       .set(Math.random(), Math.random(), Math.random())
    //       .multiplyScalar(1000 / (100 + frameCount))
    //       .add(player.head.position),
    //     time,
    //   );
    //   wogger.log(`head position`, { head: player.head.position.toArray() });
    // }

    // shoot bullets from player hands
    const { hands } = player;
    [hands.left, hands.right].forEach((hand) => {
      const handPositionDelta = w.handPositionDelta.copy(hand.position).sub(handData[hand.side].lastPosition);
      handData[hand.side].lastPosition.copy(hand.position);
      if (handPositionDelta.lengthSq() < 0.00000001) {
        return;
      }

      const handVelocity = w.handVelocity.copy(handPositionDelta).multiplyScalar(1 / deltaTimeSec);
      const handDirectionFromPlayerCore = w.handDirectionFromPlayerCore
        .copy(hand.position)
        .sub(w.v.set(0, -0.1, 0).add(player.head.position))
        .normalize();
      const handSpeedFromOrigin = handVelocity.dot(handDirectionFromPlayerCore);

      // shoot bullet from hand
      const attachedBullet = entities.bullets.find((x) => x.userData.launchingFromHand === hand.side);

      // attach bullet to hand
      if (!attachedBullet && handSpeedFromOrigin > minBulletAttachSpeed) {
        const bullet = entities.bullets.find(
          (x) => !x.active && !x.userData.launchingFromHand && x.userData.coolDown < time,
        );
        if (!bullet) {
          return;
        }

        bullet.userData.launchingFromHand = hand.side;
        bullet.userData.launchStage = LaunchStage._01originating;
        bullet.userData.iLaunchHistory = 0;
        bullet.userData.launchHistoryCount = 0;
        return;
      }

      if (!attachedBullet) {
        return;
      }

      // keep bullet with hand
      addDebugMarker(`debugG`, hand.position, time);

      attachedBullet.userData.iLaunchHistory++;
      if (attachedBullet.userData.iLaunchHistory >= attachedBullet.userData.launchPositions.length) {
        attachedBullet.userData.iLaunchHistory = 0;
      }
      attachedBullet.userData.launchPositions[attachedBullet.userData.iLaunchHistory].copy(hand.position);
      attachedBullet.userData.launchHistoryCount++;

      if (attachedBullet.userData.launchStage === LaunchStage._01originating) {
        attachedBullet.userData.launchStage++;
        return;
      }

      if (attachedBullet.userData.launchStage === LaunchStage._02accelerating) {
        if (handSpeedFromOrigin < minBulletAttachSpeed) {
          // cancel launch
          attachedBullet.userData.launchStage = LaunchStage.none;
          attachedBullet.userData.launchingFromHand = false;
          return;
        }

        if (handSpeedFromOrigin > minBulletLaunchSpeed) {
          attachedBullet.active = true;
          attachedBullet.userData.launchSpeed = handSpeedFromOrigin;
          attachedBullet.physics.rigidBody.setBodyType(RigidBodyType.KinematicPositionBased, true);
          attachedBullet.physics.rigidBody.setTranslation(hand.position, true);
          attachedBullet.userData.launchStage++;
        }
        return;
      }

      attachedBullet.physics.rigidBody.setTranslation(hand.position, true);
      if (attachedBullet.userData.launchStage === LaunchStage._03continuing) {
        if (handSpeedFromOrigin > attachedBullet.userData.launchSpeed) {
          // if hand is moving faster, update launch settings
          attachedBullet.userData.launchSpeed = handSpeedFromOrigin;
        }

        if (handSpeedFromOrigin < minBulletAttachSpeed) {
          // if hand is retracting, launch bullet
          attachedBullet.userData.launchStage++;
        }
        return;
      }

      if (attachedBullet.userData.launchHistoryCount <= 3) {
        // cancel launch
        attachedBullet.userData.launchStage = LaunchStage.none;
        attachedBullet.userData.launchingFromHand = false;
        hideEntity(attachedBullet);
        return;
      }

      // Launch
      attachedBullet.userData.launchStage = LaunchStage.none;
      attachedBullet.userData.launchingFromHand = false;

      const getAveragePosition = (ratioMin: number, ratioMax: number, marker: `debugR` | `debugB`) => {
        w.v.set(0, 0, 0);
        const count = Math.min(100, attachedBullet.userData.launchHistoryCount);
        const iBackMin = Math.floor(ratioMin * count);
        const iBackMax = Math.ceil(ratioMax * count);
        for (let i = iBackMin; i <= iBackMax; i++) {
          const iHistory = (attachedBullet.userData.iLaunchHistory - i + 200) % 100;
          w.v.add(attachedBullet.userData.launchPositions[iHistory]);

          addDebugMarker(marker, attachedBullet.userData.launchPositions[iHistory], time);
        }
        w.v.multiplyScalar(1 / (iBackMax - iBackMin + 1));
        return w.v;
      };

      const launchVector = w.bulletLaunchVector
        .copy(getAveragePosition(0.4, 0.6, `debugR`))
        .sub(getAveragePosition(0.6, 0.8, `debugB`))
        .normalize()
        .multiplyScalar(attachedBullet.userData.launchSpeed * 2);

      attachedBullet.physics.rigidBody.setBodyType(RigidBodyType.Dynamic, true);
      attachedBullet.physics.rigidBody.applyImpulse(
        w.v.copy(launchVector).multiplyScalar(attachedBullet.physics.rigidBody.mass()),
        true,
      );
    });

    entities.bullets
      .filter((x) => x.active && !x.userData.launchingFromHand)
      .forEach((bullet) => {
        // if too slow, remove bullet
        // const bulletLinearVelocity = bullet.physics.rigidBody.linvel();
        // const bulletVelocity = w.bulletVelocity.set(
        //   bulletLinearVelocity.x,
        //   bulletLinearVelocity.y,
        //   bulletLinearVelocity.z,
        // );
        // if (bulletVelocity.lengthSq() < 0.01) {
        //   hideEntity(bullet);
        // }

        // if too far, remove bullet
        const bulletTranslation = bullet.physics.rigidBody.translation();
        const bulletPosition = w.bulletPosition.set(bulletTranslation.x, bulletTranslation.y, bulletTranslation.z);
        const bulletDiffFromOrigin = w.bulletDiffFromOrigin.copy(bulletPosition).sub(player.head.position);
        if (bulletDiffFromOrigin.lengthSq() > 100) {
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
            const bulletPosition = w.bulletPosition.set(bulletTranslation.x, bulletTranslation.y, bulletTranslation.z);
            const enemyTranslation = enemy.physics.rigidBody.translation();
            const enemyPosition = w.enemyPosition.set(enemyTranslation.x, enemyTranslation.y, enemyTranslation.z);
            const distanceBetweenSq = w.v.copy(bulletPosition).sub(enemyPosition).lengthSq();
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
