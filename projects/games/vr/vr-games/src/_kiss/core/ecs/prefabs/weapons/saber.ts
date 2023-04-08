import { Ecs } from '../../components/_components';

export const createWeapon_saber = (
  ecs: Ecs,
  position: [number, number, number],
  scale: number = 1,
  attachedHandSide?: `left` | `right` | `mouse`,
  autoHide?: boolean,
) => {
  //const angle = Math.PI * 0.15;
  const angle = 0; // Math.PI * 0.15;
  const saber = ecs
    .entity(`saber`)
    .transform({ position })
    .rigidBody({ kind: `dynamic`, collisionTag: `weapon` })
    .inputHandAttachable({ handAttachableKind: `sword`, attachmentPosition: [0, 0.08, 0], attachedHandSide, autoHide })
    .addChild(
      ecs
        .entity(`blade`)
        .transform({ position: [0, 0.55 * scale, -Math.sin(angle) * 0.55 * scale], rotation: [-angle, 0, 0] })
        .shape_box({ scale: [0.002 * scale, 0.92 * scale, 0.02 * scale] })
        .collider({ restitution: 1, colliderEvents: true })
        .graphics({ color: 0xff0000 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`handle`)
        .transform({ position: [0, 0.1 * scale, -Math.sin(angle) * 0.1 * scale], rotation: [-angle, 0, 0] })
        .shape_box({ scale: [0.025 * scale, 0.2 * scale, 0.025 * scale] })
        .collider({ restitution: 0, friction: 10, colliderEvents: true })
        .graphics({ color: 0x555555 })
        .build(),
    )
    .addChild(
      ecs
        .entity(`guard`)
        .transform({ position: [0, 0.2 * scale, -Math.sin(angle) * 0.2 * scale], rotation: [-angle, 0, 0] })
        .shape_box({ scale: [0.06 * scale, 0.001 * scale, 0.06 * scale] })
        .collider({ restitution: 0, friction: 10, colliderEvents: true })
        .graphics({ color: 0x555555 })
        .build(),
    )
    .build();

  return saber;
};
