import type { Triplet } from '@react-three/cannon';
import type {} from 'three';
import { EntityForce } from './components/force';
import { EntityGravity } from './components/gravity';
import { EntityAdjustToGround, EntityGround } from './components/ground';
import { EntityGroundView } from './components/ground-view';
import { EntityHumanoidBody } from './components/humanoid-body/humanoid-body';
import { EntityCollisionFilterGroup, EntityPhysicsView } from './components/physics-view';
import { EntityPhysicsViewSphere } from './components/physics-view-sphere';
import { EntityPlayer } from './components/player';
import { EntityProblemEngine } from './components/problem-engine';
import { EntitySelectable, EntitySelector } from './components/selectable';
import { EntityRaycastSelector } from './components/selectable-raycast-selector';
import { EntityRaycastSelectorCollider } from './components/selectable-raycast-selector-collider';
import { EntitySpawnable } from './components/spawnable';
import { EntitySpawner } from './components/spawner';
import { EntityTextView } from './components/text-view';
import { defineEntity, EntityBase, EntityWithChildren, SimplifyEntity } from './core';

// prettier-ignore
type EntityUnion = EntityBase & (
| EntityWithChildren
| EntitySpawnable
| EntitySpawner
| EntityPlayer
| EntityHumanoidBody
| EntityTextView
| EntityProblemEngine
| EntityGround
| EntityGroundView
| EntityAdjustToGround
| EntityGravity
| EntitySelectable
| EntitySelector
| EntityRaycastSelector
| EntityRaycastSelectorCollider
| EntityCollisionFilterGroup
| EntityPhysicsView
| EntityPhysicsViewSphere
| EntityForce
);

export type Entity = SimplifyEntity<EntityUnion>;

export const Entity = defineEntity<Entity>();

export type World = EntityWithChildren;

export type SceneDefinition = {
  rootEntities: Entity[];
  gravity?: Triplet;
  iterations?: number;
  debugPhysics?: boolean;
};
