import { Observable, Subject } from 'rxjs';
import { Vector3 } from 'three';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';

export type SelectionState = `inactive` | `hover` | `down`;
export type SelectionEvent = `hoverStart` | `hoverContinue` | `hoverEnd` | `downStart` | `downContinue` | `downEnd`;
export type EntitySelectable = EntityBase & {
  selectable: {
    state: SelectionState;
    stateSubject: Subject<{
      entity: EntitySelectable;
      event: SelectionEvent;
      mode: SelectorMode;
      sequence: SelectorSequence;
    }>;
    hoverCount: number;
    downCount: number;

    /** Selectors that are targetting this selectable */
    selectors?: EntitySelector[];
  };
  transform: {
    position: Vector3;
  };
};

export type SelectorMode = `none` | `hover` | `down`;
export type SelectorSequence = `begin` | `end` | `continue`;
export type EntitySelector = EntityBase & {
  selector: {
    mode: SelectorMode;
    targets?: EntitySelectable[];
    activeTarget?: EntitySelectable;
  };
};

export const EntitySelectable = defineComponent<EntitySelectable>()
  .with(`selectable`, ({}: {}) => {
    return {
      state: `inactive`,
      hoverCount: 0,
      downCount: 0,
      stateSubject: new Subject(),
    };
  })
  .attach({
    subscribeToEvent: (
      eventObservable: Observable<{
        selectable: EntitySelectable;
        selector: EntitySelector;
        sequence: SelectorSequence;
      }>,
    ) => {
      eventObservable.subscribe(EntitySelectable.handleEvent);
    },
    handleEvent: ({
      selectable,
      selector,
      sequence,
    }: {
      selectable: EntitySelectable;
      selector: EntitySelector;
      sequence: SelectorSequence;
    }) => {
      const Suffix = sequence === `begin` ? `Start` : sequence === `end` ? `End` : `Continue`;
      const mode = selector.selector.mode;

      logger.log(`handleEvent`, { mode, Suffix, n: selectable.name, k: selectable.key });

      if (!mode || mode === `none`) {
        return;
      }
      const name = `${mode}${Suffix}` as const;
      EntitySelectable[name](selectable);
    },
    hoverStart: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverStart`, { name: entity.name, key: entity.key, s: s.state });

      s.hoverCount++;
      if (s.hoverCount === 1 && s.state === `inactive`) {
        s.state = `hover`;
        s.stateSubject.next({ entity, event: `hoverStart`, mode: `hover`, sequence: `begin` });
      }
    },
    hoverContinue: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverContinue`, { name: entity.name, key: entity.key, s: s.state });
      s.stateSubject.next({ entity, event: `hoverContinue`, mode: `hover`, sequence: `continue` });
    },
    hoverEnd: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`hoverEnd`, { name: entity.name, key: entity.key, s: s.state });

      s.hoverCount--;
      if (s.hoverCount === 0 && s.state === `hover`) {
        s.state = `inactive`;
        s.stateSubject.next({ entity, event: `hoverEnd`, mode: `hover`, sequence: `end` });
      }
    },
    downStart: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downStart`, { name: entity.name, key: entity.key, s: s.state });

      s.downCount++;
      if (s.downCount === 1 && s.state !== `down`) {
        s.state = `down`;
        s.stateSubject.next({ entity, event: `downStart`, mode: `down`, sequence: `begin` });
      }
    },
    downContinue: (entity: EntitySelectable) => {
      const s = entity.selectable;
      logger.log(`downStart`, { name: entity.name, key: entity.key, s: s.state });
      s.stateSubject.next({ entity, event: `downContinue`, mode: `down`, sequence: `continue` });
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
        s.stateSubject.next({ entity, event: `downEnd`, mode: `down`, sequence: `end` });
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
