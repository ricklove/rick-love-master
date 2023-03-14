import type {} from '@react-three/cannon';
import type {} from 'three';
import { EntityForce } from './components/force';
import { EntityGravity } from './components/gravity';
import { EntityAdjustToGround, EntityGround } from './components/ground';
import { EntityGroundView } from './components/ground-view';
import { EntityPhysicsView } from './components/physics-view';
import { EntityPhysicsViewSphere } from './components/physics-view-sphere';
import { EntityPlayer } from './components/player';
import { EntityPlayerBody } from './components/player-body/player-body';
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
| EntityPlayerBody
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
| EntityPhysicsView
| EntityPhysicsViewSphere
| EntityForce
);

export type Entity = SimplifyEntity<EntityUnion>;

export const Entity = defineEntity<Entity>();

export type World = Entity & EntityWithChildren;
