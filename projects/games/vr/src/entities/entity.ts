import type {} from 'three';
import { EntityGround, EntityKeepAboveGround } from './components/ground';
import { defineEntity, EntityBase } from './core';

// prettier-ignore
export type Entity = EntityBase & (
| EntityGround
| EntityKeepAboveGround
);

export const Entity = defineEntity<Entity>();

export type World = {
  entities: Entity[];
};
