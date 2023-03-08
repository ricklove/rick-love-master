import type {} from 'three';
import { EntityGravity } from './components/gravity';
import { EntityAdjustToGround, EntityGround } from './components/ground';
import { EntityGroundView } from './components/ground-view';
import { EntityRaycastSelector, EntitySelectable } from './components/selectable';
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
| EntityRaycastSelector
);

export type Entity = SimplifyEntity<EntityUnion>;

export const Entity = defineEntity<Entity>();

export type World = {
  entities: Entity[];
};
