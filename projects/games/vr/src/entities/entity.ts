import type {} from 'three';
import { EntityGravity } from './components/gravity';
import { EntityAdjustToGround, EntityGround } from './components/ground';
import { EntityGroundView } from './components/ground-view';
import { EntitySelectable, EntitySelector } from './components/selectable';
import { EntityRaycastSelector } from './components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from './components/selectable-raycast-selector-collider';
import { EntityRaycastSelectorPhysics } from './components/selectable-raycast-selector-physics';
import { EntityRaycastSelectorThree } from './components/selectable-raycast-selector-three';
import { EntitySphereView } from './components/sphere-view';
import { defineEntity, EntityBase, SimplifyEntity } from './core';

// prettier-ignore
type EntityUnion = EntityBase & (
| EntityGround
| EntityGroundView
| EntityAdjustToGround
| EntitySphereView
| EntityGravity
| EntitySelectable
| EntitySelector
| EntityRaycastSelector
| EntityRaycastSelectorThree
| EntityRaycastSelectorPhysics
| EntityRaycastSelectorCollider
);

export type Entity = SimplifyEntity<EntityUnion>;

export const Entity = defineEntity<Entity>();

export type World = {
  entities: Entity[];
};
