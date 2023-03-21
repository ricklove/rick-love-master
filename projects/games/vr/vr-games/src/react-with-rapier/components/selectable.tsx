import { useMemo } from 'react';
import {
  CollisionEnterPayload,
  CollisionExitPayload,
  IntersectionEnterPayload,
  IntersectionExitPayload,
  RapierRigidBody,
} from '@react-three/rapier';
import { BehaviorSubject } from 'rxjs';
import { createContextWithDefault } from '../../utils/contextWithDefault';
import { logger } from '../../utils/logger';

export enum SelectionMode {
  none = 0,
  hover = 1,
  select = 2,
}

type Selector = {
  rigidBody?: RapierRigidBody;
  mode: BehaviorSubject<SelectionMode>;
};

const SelectableContextInner = createContextWithDefault(() => ({
  selectors: [] as Selector[],
}));

const useSelector = () => {
  const s = SelectableContextInner.useContext();
  const { selector } = useMemo(() => {
    const id = s.selectors.length;
    s.selectors.push({ mode: new BehaviorSubject<SelectionMode>(SelectionMode.none) });
    return {
      selector: s.selectors[id],
    };
  }, []);

  return {
    setRigidbody: (rigidBody: RapierRigidBody) => {
      selector.rigidBody = rigidBody;
    },
    setMode: (mode: SelectionMode) => {
      selector.mode.next(mode);
    },
  };
};

type SelectableEvent = {
  event: `none` | `${`hover` | `select`}-${`enter` | `exit`}`;
  mode: SelectionMode;
  oldMode: SelectionMode;
};
const useSelectable = (subscribe: (event: SelectableEvent) => void) => {
  const s = SelectableContextInner.useContext();
  const { selectable, updateMode } = useMemo(() => {
    const selectable = {
      mode: new BehaviorSubject<SelectableEvent>({
        event: `none`,
        mode: SelectionMode.none,
        oldMode: SelectionMode.none,
      }),
      activeSelectors: new Map<Selector, { selector: Selector; subscription: { unsubscribe: () => void } }>(),
    };
    selectable.mode.subscribe(subscribe);

    const updateMode = () => {
      let maxModeValue = 0;
      selectable.activeSelectors.forEach((xRaw) => {
        const x = xRaw.selector.mode.value as number;
        maxModeValue = x > maxModeValue ? x : maxModeValue;
      });
      const newMode = maxModeValue as SelectionMode;
      if (newMode === selectable.mode.value.mode) {
        return;
      }

      if (newMode >= SelectionMode.hover && selectable.mode.value.mode < SelectionMode.hover) {
        selectable.mode.next({
          event: `hover-enter`,
          mode: SelectionMode.hover,
          oldMode: selectable.mode.value.mode,
        });
      }
      if (newMode >= SelectionMode.select && selectable.mode.value.mode < SelectionMode.select) {
        selectable.mode.next({
          event: `select-enter`,
          mode: SelectionMode.select,
          oldMode: selectable.mode.value.mode,
        });
      }
      if (newMode < SelectionMode.select && selectable.mode.value.mode >= SelectionMode.select) {
        selectable.mode.next({
          event: `select-exit`,
          mode: SelectionMode.hover,
          oldMode: selectable.mode.value.mode,
        });
      }
      if (newMode < SelectionMode.hover && selectable.mode.value.mode >= SelectionMode.hover) {
        selectable.mode.next({
          event: `hover-exit`,
          mode: SelectionMode.none,
          oldMode: selectable.mode.value.mode,
        });
      }
    };
    return {
      selectable,
      updateMode,
    };
  }, []);

  const enter = (e: CollisionEnterPayload | IntersectionEnterPayload) => {
    const other = e.other.rigidBody;
    const selector = s.selectors.find((x) => x.rigidBody === other);
    logger.log(`enter other`, { selector, other, selectors: s.selectors });

    if (!selector) {
      return;
    }

    if (selectable.activeSelectors.has(selector)) {
      return;
    }
    const sub = selector.mode.subscribe(() => {
      updateMode();
    });
    selectable.activeSelectors.set(selector, { selector, subscription: sub });
    updateMode();
  };

  const exit = (e: CollisionExitPayload | IntersectionExitPayload) => {
    const other = e.other.rigidBody;
    const selector = s.selectors.find((x) => x.rigidBody === other);
    logger.log(`exit other`, { selector, other, selectors: s.selectors });

    if (!selector) {
      return;
    }
    const selectorData = selectable.activeSelectors.get(selector);
    if (!selectorData) {
      return;
    }
    selectorData.subscription.unsubscribe();
    selectable.activeSelectors.delete(selector);
    updateMode();
  };

  return {
    onCollisionEnter: (e: CollisionEnterPayload) => {
      enter(e);
    },
    onCollisionExit: (e: CollisionExitPayload) => {
      exit(e);
    },
    onIntersectionEnter: (e: IntersectionEnterPayload) => {
      enter(e);
    },
    onIntersectionExit: (e: IntersectionExitPayload) => {
      exit(e);
    },
  };
};

export const SelectableContext = {
  Provider: SelectableContextInner.Provider,
  useSelector,
  useSelectable,
};
