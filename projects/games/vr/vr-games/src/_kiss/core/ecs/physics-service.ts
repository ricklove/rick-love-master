import { World } from '@dimforge/rapier3d-compat';
import { Vector3 } from 'three';

export type PhysicsService = {
  world: World;
  handleEntityIds: Map<number, number>;
};

export const createPhysicsService = (): PhysicsService => {
  return {
    world: new World(new Vector3(0, -9.81, 0)),
    handleEntityIds: new Map<number, number>(),
  };
};
