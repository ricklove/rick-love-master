import { Vector3 } from 'three';
import { defineComponent } from '../../core';
import { EntityHumanoidBody } from './humanoid-body';

export type EntityHumanoidBodyMoverGroovy = EntityHumanoidBody & {
  humanoidBodyMoverGroovy: {
    enabled: boolean;
    direction: Vector3;
    speed: number;
    yRatio: number;
    _subscription?: { unsubscribe: () => void };
  };
};
export const EntityHumanoidBodyMoverGroovy = defineComponent<EntityHumanoidBodyMoverGroovy>()
  .with(
    `humanoidBodyMoverGroovy`,
    (
      {
        enabled = true,
        direction,
        speed,
        autoStart = true,
        yRatio = 1,
      }: { direction?: Vector3; speed?: number; autoStart?: boolean; yRatio?: number; enabled?: boolean },
      e,
    ) => {
      if (autoStart) {
        setTimeout(() => {
          setupMovement(e);
        });
      }
      return {
        enabled,
        direction: direction ?? new Vector3(),
        speed: speed ?? 1,
        yRatio,
      };
    },
  )
  .attach({
    setMovement: (e: EntityHumanoidBodyMoverGroovy, direction: Vector3, speed: number) => {
      e.humanoidBodyMoverGroovy.direction.copy(direction);
      e.humanoidBodyMoverGroovy.speed = speed;

      setupMovement(e);
    },
    stopMovement: (e: EntityHumanoidBodyMoverGroovy) => {
      e.humanoidBodyMoverGroovy._subscription?.unsubscribe();
    },
  });

const setupMovement = (e: EntityHumanoidBodyMoverGroovy) => {
  if (e.humanoidBodyMoverGroovy._subscription) {
    return;
  }

  const subs = [] as { unsubscribe: () => void }[];

  // Make the check static
  const mainPart = e.humanoidBody.parts.find((x) => x.part === `upper-torso`)!;
  const partsToMove = [
    `head`,
    // `foot`,
    // `neck`,
    `upper-leg`,
    `lower-leg`,
    `upper-torso`,
    // `foot`,
    `lower-torso`,
    `upper-arm`,
    `lower-leg`,
  ]
    // const partsToMove = [`neck`, `upper-torso`, `lower-torso`]
    .flatMap((partName) => e.humanoidBody.parts.filter((x) => x.part === partName)!)
    .filter((x) => !!x);
  subs.push(
    mainPart.entity.ready.subscribe(() => {
      const forward = new Vector3(0, 0, -1);
      const up = new Vector3(0, 1, 0);
      const dir = new Vector3();
      const vel = new Vector3();
      const rot = new Vector3();

      let step = 0;

      const yMult = e.humanoidBodyMoverGroovy.yRatio * 2 + 10 * Math.random();
      const yTargetMult = e.humanoidBodyMoverGroovy.yRatio * 0.6 + 1 * Math.random();
      let maxHeight = 0;

      partsToMove.forEach((p, iPart) => {
        // p.entity.physics.api.mass.set(100000);
        // p.entity.physics.api.mass.set(0);

        let targetHeight = 0;

        subs.push(
          p.entity.frameTrigger.subscribe(() => {
            if (!e.humanoidBodyMoverGroovy.enabled) {
              return;
            }

            const speed = e.humanoidBodyMoverGroovy.speed;
            const cycleSpeed = speed;
            const dirAngle =
              -Math.sign(e.humanoidBodyMoverGroovy.direction.x) *
              dir.copy(forward).angleTo(e.humanoidBodyMoverGroovy.direction);
            const pos = p.entity.transform.position;

            // logger.log(`dirAngle`, { dirAngle, pos });

            if (p.part === `head` && step % 2 === 0) {
              vel.set(0, 0.1, -0.2 * speed).applyAxisAngle(up, dirAngle);
              p.entity.physics.api.velocity.set(vel.x, vel.y, vel.z);
              p.entity.physics.api.angularVelocity.set(0, 0, 0);
            }
            if (iPart === 0) {
              step++;
            }

            if (step === 1) {
              targetHeight = pos.y;
              maxHeight = Math.max(targetHeight, maxHeight);
            }

            if (step % partsToMove.length !== iPart) {
              return;
            }

            // p.entity.physics.api.position.set(pos[0], 0.7, pos[2] - 0.01);
            const iTimeDelta = (45617 * iPart) % 31;

            const heightRatio = targetHeight / maxHeight;
            const forwardBoostMult = 1 + 0.2 * (1 - heightRatio);
            const heightBoostMult = 1 + 0.2 * (1 - heightRatio);

            const yTarget = yTargetMult * targetHeight;
            const yDelta =
              yTarget * (0.8 + 0.2 * Math.sin((1 / 0.3) * cycleSpeed * ((Date.now() + iTimeDelta) / 1000))) - pos.y;
            const yDeltaRatio = yDelta / yTarget;
            const yStrength = 1 - Math.pow(yDeltaRatio, 3);
            const yVel = heightBoostMult * yMult * (0.05 + yDelta * yStrength);
            const zVel =
              forwardBoostMult *
              speed *
              -0.3 *
              (0.6 + 0.4 * Math.sin(((1 / 0.7) * cycleSpeed * (Date.now() + iTimeDelta)) / 1000));
            const angle = Math.PI * 0.25 * Math.sin(((1 / 3) * cycleSpeed * (Date.now() + iTimeDelta)) / 1000);
            vel.set(0, yVel, zVel).applyAxisAngle(up, dirAngle);
            rot.set(angle * 0.7, dirAngle + angle, angle * 0.3);

            // logger.log(`vel`, { vel, dirAngle, yVel, zVel });

            p.entity.physics.api.velocity.set(vel.x, vel.y, vel.z);
            p.entity.physics.api.angularVelocity.set(rot.x / 60, rot.y / 60, rot.z / 60);

            if (Math.floor(step / partsToMove.length) % 20 === (57 * iPart) % 20) {
              p.entity.physics.api.rotation.set(rot.x, rot.y, rot.z);
            }
          }),
        );
      });
    }),
  );

  e.humanoidBodyMoverGroovy._subscription = {
    unsubscribe: () => {
      subs.forEach((x) => x.unsubscribe());
      e.humanoidBodyMoverGroovy._subscription = undefined;
    },
  };
};
