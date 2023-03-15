import { BehaviorSubject, Observable } from 'rxjs';
import { defineComponent, EntityBase, EntityWithTransform } from '../core';

export type SelectionMode = `none` | `hover` | `down`;
export type SelectionSequence = `none` | `begin` | `end` | `continue`;
export type SelectionEvent = `none` | `hover-begin` | `hover-end` | `down-begin` | `down-end`;

export type EntitySelectable = EntityWithTransform & {
  selectable: {
    stateSubject: BehaviorSubject<{
      entity: EntitySelectable;
      event: SelectionEvent;
      mode: SelectionMode;
      sequence: SelectionSequence;
    }>;

    /** Active selections */
    selectors: { [key: string]: { selector: EntitySelector; mode: SelectionMode } };
  };
};

export type EntitySelector = EntityBase & {
  selector: {
    mode: SelectionMode;
    targets?: EntitySelectable[];

    /** Active selections */
    selectables: { [key: string]: { selectable: EntitySelectable } };
  };
};

export const EntitySelectable = defineComponent<EntitySelectable>()
  .with(`selectable`, () => {
    return {
      state: `inactive`,
      stateSubject: new BehaviorSubject({
        entity: undefined as unknown as EntitySelectable,
        event: `none` as SelectionEvent,
        mode: `none` as SelectionMode,
        sequence: `none` as SelectionSequence,
      }),
      selectors: {},
    };
  })
  .attach({
    subscribeToEvent: (
      eventObservable: Observable<{
        selectable: EntitySelectable;
        selector: EntitySelector;
        sequence: SelectionSequence;
      }>,
    ) => {
      eventObservable.subscribe(EntitySelectable.handleEvent);
    },
    handleEvent: ({
      selectable,
      selector,
      sequence,
      mode: newMode,
    }: {
      selectable: EntitySelectable;
      selector: EntitySelector;
      sequence: SelectionSequence;
      mode?: SelectionMode;
    }) => {
      const mode = newMode ?? selector.selector.mode;
      const oldMode = selectable.selectable.selectors[selector.key]?.mode ?? `none`;

      // logger.log(`handleEvent`, { mode, oldMode, sequence });

      const emit = (m: `hover` | `down`, s: `begin` | `end`) => {
        // logger.log(`emit`, { event: `${m}-${s}` });

        selectable.selectable.stateSubject.next({
          entity: selectable,
          event: `${m}-${s}`,
          mode: m,
          sequence: s,
        });
      };

      if (sequence === `end`) {
        delete selectable.selectable.selectors[selector.key];
        delete selector.selector.selectables[selectable.key];
        if (oldMode === `down`) {
          emit(`down`, `end`);
          emit(`hover`, `end`);
          return;
        }
        if (oldMode === `hover`) {
          emit(`hover`, `end`);
          return;
        }
        const _none: `none` = oldMode;
        return;
      }

      if (mode === oldMode) {
        return;
      }

      selectable.selectable.selectors[selector.key] = { mode, selector };
      selector.selector.selectables[selectable.key] = { selectable };
      if (mode === `none`) {
        if (oldMode === `down`) {
          emit(`down`, `end`);
          emit(`hover`, `end`);
          return;
        }
        if (oldMode === `hover`) {
          emit(`hover`, `end`);
          return;
        }
        const _same: typeof mode = oldMode;
        return;
      }

      if (sequence === `continue` || sequence === `begin`) {
        if (mode === `down`) {
          if (oldMode === `hover`) {
            emit(`down`, `begin`);
            return;
          }
          if (oldMode === `none`) {
            emit(`hover`, `begin`);
            emit(`down`, `begin`);
            return;
          }
          const _same: typeof mode = oldMode;
          return;
        }

        if (mode === `hover`) {
          if (oldMode === `down`) {
            emit(`down`, `end`);
            return;
          }
          if (oldMode === `none`) {
            emit(`hover`, `begin`);
            return;
          }
          const _same: typeof mode = oldMode;
          return;
        }
        const _never: never = mode;
        return;
      }

      const _none: `none` = `none`;
    },
  });

export const EntitySelector = defineComponent<EntitySelector>()
  .with(`selector`, () => {
    return {
      mode: `none`,
      selectables: {},
    };
  })
  .attach({
    changeSelectionMode: (entity: EntitySelector, mode: `none` | `hover` | `down`) => {
      const r = entity.selector;
      if (r.mode === mode) {
        return;
      }

      // logger.log(`changeSelectionMode`, { mode, old: r.mode });

      r.mode = mode;
      Object.entries(entity.selector.selectables).forEach(([k, { selectable }]) => {
        EntitySelectable.handleEvent({ selector: entity, selectable, sequence: `continue`, mode });
      });
    },
  });
