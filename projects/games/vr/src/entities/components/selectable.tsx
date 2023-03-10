import { CollideBeginEvent, CollideEndEvent, CollideEvent } from '@react-three/cannon';
import { Subject } from 'rxjs';
import { Object3D, Vector3 } from 'three';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';

export type SelectionState = `inactive` | `hover` | `down`;
export type SelectionEvent = `hoverStart` | `hoverContinue` | `hoverEnd` | `downStart` | `downContinue` | `downEnd`;
export type EntitySelectable = EntityBase & {
  selectable: {
    state: SelectionState;
    hoverCount: number;
    downCount: number;
    observeStateChange: Subject<{
      entity: EntitySelectable;
      event: SelectionEvent;
    }>;
    target?: Object3D;
    targetInstanceId?: number;
    targetPhysicsObject?: unknown;
    radius?: number;
    /** Selectors that are targetting this selectable */
    selectors?: EntitySelector[];
  };
  transform: {
    position: Vector3;
  };
};

export type SelectorMode = `none` | `hover` | `down`;
export type EntitySelector = EntityBase & {
  selector: {
    mode: SelectorMode;
    targets?: EntitySelectable[];
    activeTarget?: EntitySelectable;
  };
};

export const EntitySelectable = defineComponent<EntitySelectable>()
  .with(`selectable`, ({ target, radius }: { target?: Object3D; radius?: number }) => {
    return {
      state: `inactive`,
      hoverCount: 0,
      downCount: 0,
      observeStateChange: new Subject(),
      target,
      radius,
    };
  })
  .attach({
    _getCollideSelectorMode: (entity: EntitySelectable, e: CollideBeginEvent | CollideEndEvent | CollideEvent) => {
      const selectorKey = e.body.userData.key as undefined | string;
      if (!selectorKey) {
        return;
      }
      const selector = entity.selectable.selectors?.find((s) => s.key === selectorKey);
      if (!selector) {
        return;
      }
      const mode = selector.selector.mode;
      return mode;
    },
    onCollideBegin: (entity: EntitySelectable, e: CollideBeginEvent) => {
      const mode = EntitySelectable._getCollideSelectorMode(entity, e);
      if (mode === `hover`) {
        EntitySelectable.hoverStart(entity);
        return;
      }
      if (mode === `down`) {
        EntitySelectable.downStart(entity);
        return;
      }
    },
    onCollide: (entity: EntitySelectable, e: CollideEvent) => {
      const mode = EntitySelectable._getCollideSelectorMode(entity, e);
      if (mode === `hover`) {
        EntitySelectable.hoverContinue(entity);
        return;
      }
      if (mode === `down`) {
        EntitySelectable.downContinue(entity);
        return;
      }
    },
    onCollideEnd: (entity: EntitySelectable, e: CollideEndEvent) => {
      const mode = EntitySelectable._getCollideSelectorMode(entity, e);
      if (mode === `hover`) {
        EntitySelectable.hoverEnd(entity);
        return;
      }
      if (mode === `down`) {
        EntitySelectable.downEnd(entity);
        return;
      }
    },
    hoverStart: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverStart`, { name: entity.name, key: entity.key, s: s.state });

      s.hoverCount++;
      if (s.hoverCount === 1 && s.state === `inactive`) {
        s.state = `hover`;
        s.observeStateChange.next({ entity, event: `hoverStart` });
      }
    },
    hoverContinue: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverContinue`, { name: entity.name, key: entity.key, s: s.state });
      s.observeStateChange.next({ entity, event: `hoverContinue` });
    },
    hoverEnd: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverEnd`, { name: entity.name, key: entity.key, s: s.state });

      s.hoverCount--;
      if (s.hoverCount === 0 && s.state === `hover`) {
        s.state = `inactive`;
        s.observeStateChange.next({ entity, event: `hoverEnd` });
      }
    },
    downStart: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downStart`, { name: entity.name, key: entity.key, s: s.state });

      s.downCount++;
      if (s.downCount === 1 && s.state !== `down`) {
        s.state = `down`;
        s.observeStateChange.next({ entity, event: `downStart` });
      }
    },
    downContinue: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downStart`, { name: entity.name, key: entity.key, s: s.state });
      s.observeStateChange.next({ entity, event: `downContinue` });
    },
    downEnd: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downEnd`, { name: entity.name, key: entity.key, s: s.state });

      s.downCount--;
      if (s.downCount === 0) {
        if (s.hoverCount) {
          s.state = `hover`;
        } else {
          s.state = `inactive`;
        }
        s.observeStateChange.next({ entity, event: `downEnd` });
      }
    },
  });

export const EntitySelector = defineComponent<EntitySelector>()
  .with(`selector`, () => {
    return {
      mode: `none`,
    };
  })
  .attach({
    changeSelectionMode: (entity: EntitySelector, mode: `none` | `hover` | `down`) => {
      const r = entity.selector;
      if (r.mode === mode) {
        return;
      }

      logger.log(`changeSelectionMode`, { mode });

      if (r.activeTarget) {
        if (mode === `down`) {
          EntitySelectable.downStart(r.activeTarget);
        }
        if (mode === `hover`) {
          EntitySelectable.hoverStart(r.activeTarget);
        }
        if (r.mode === `down`) {
          EntitySelectable.downEnd(r.activeTarget);
        }
        if (r.mode === `hover`) {
          EntitySelectable.hoverEnd(r.activeTarget);
        }
      }

      r.mode = mode;
    },
    changeTargets: (entity: EntitySelector, targets: EntitySelectable[]) => {
      const r = entity.selector;
      logger.log(`changeTargets`, { targets: targets.length });

      // Update selectors
      const oldTargetsSet = new Set(r.targets ?? []);
      const newTargetsSet = new Set(targets ?? []);
      const added = targets.filter((x) => !oldTargetsSet.has(x));
      const removed = r.targets?.filter((x) => !newTargetsSet.has(x)) ?? [];
      removed.forEach((x) => {
        const selectors = (x.selectable.selectors = x.selectable.selectors ?? []);
        selectors.splice(selectors.indexOf(entity), 1);
      });
      added.forEach((x) => {
        const selectors = (x.selectable.selectors = x.selectable.selectors ?? []);
        selectors.push(entity);
      });

      r.targets = targets;
    },
    changeActiveTarget: (entity: EntitySelector, target: undefined | EntitySelectable) => {
      const r = entity.selector;
      const s = target;
      if (s === r.activeTarget) {
        return;
      }

      if (r.activeTarget) {
        (r.mode === `hover` ? EntitySelectable.hoverEnd : EntitySelectable.downEnd)(r.activeTarget);
      }

      r.activeTarget = s;
      if (!r.activeTarget) {
        return;
      }

      (r.mode === `hover` ? EntitySelectable.hoverStart : EntitySelectable.downStart)(r.activeTarget);
    },
  });