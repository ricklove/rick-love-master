import { Ecs } from '../components/_components';

export const createSaber = (ecs: Ecs, position: [number, number, number], scale: number = 1) => {
  const saber = ecs
    .entity(`saber`)
    .transform({ position, quaternion: [0, 0, 0, 1] })
    .rigidBody({ kind: `dynamic` })
    .addChild(
      ecs
        .entity(`staff`)
        .transform({ position: [0, 0.55 * scale, 0], quaternion: [0, 0, 0, 1] })
        .shape_box({ scale: [0.002 * scale, 0.92 * scale, 0.02 * scale] })
        .collider({ restitution: 1 })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`handle`)
        .transform({ position: [0, 0.1 * scale, 0], quaternion: [0, 0, 0, 1] })
        .shape_box({ scale: [0.025 * scale, 0.2 * scale, 0.025 * scale] })
        .collider({ restitution: 0, friction: 10 })
        .graphics({ color: 0x555555 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`guard`)
        .transform({ position: [0, 0.2 * scale, 0], quaternion: [0, 0, 0, 1] })
        .shape_box({ scale: [0.06 * scale, 0.001 * scale, 0.06 * scale] })
        .collider({ restitution: 0, friction: 10 })
        .graphics({ color: 0x555555 })
        .build(),
    )
    .build();

  return saber;
};
