import { Ecs } from '../../components/_components';

export const createWeapon_knuckleClaws = (
  ecs: Ecs,
  position: [number, number, number],
  scale: number = 1,
  attachedHandSide?: `left` | `right`,
) => {
  const saber = ecs
    .entity(`knuckleClaws`)
    .transform({ position, quaternion: [0, 0, 0, 1] })
    .rigidBody({ kind: `dynamic` })
    .inputHandAttachable({ handAttachableKind: `knuckles`, attachmentPosition: [0, 0, 0], attachedHandSide })
    .addChild(
      ecs
        .entity(`bladeMiddle`)
        .transform({ position: [0, 0, -0.15 * scale], quaternion: [0, 0, 0, 1] })
        .shape_box({ scale: [0.01 * scale, 0.002 * scale, 0.31 * scale] })
        .collider({ restitution: 1 })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`bladeTop`)
        .transform({ position: [0, 0.015 * scale, -0.16 * scale], quaternion: [0, 0, 0, 1] })
        .shape_box({ scale: [0.01 * scale, 0.002 * scale, 0.33 * scale] })
        .collider({ restitution: 1 })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`bladeBottom`)
        .transform({ position: [0, -0.015 * scale, -0.15 * scale], quaternion: [0, 0, 0, 1] })
        .shape_box({ scale: [0.01 * scale, 0.002 * scale, 0.31 * scale] })
        .collider({ restitution: 1 })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .build();

  return saber;
};
