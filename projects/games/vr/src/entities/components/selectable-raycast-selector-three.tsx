import React from 'react';
import { Raycaster } from 'three';
import { formatVector } from '../../utils/formatters';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';
import { EntitySelectable } from './selectable';
import { EntityRaycastSelector, EntityRaycastSelectorDebugComponent } from './selectable-raycast-selector';

export type EntityRaycastSelectorThree = EntityRaycastSelector & {
  raycastSelectorThree: {
    raycaster: Raycaster;
  };
  view: {
    Component: (props: { entity: EntityBase }) => JSX.Element;
  };
};

export const EntityRaycastSelectorThree = defineComponent<EntityRaycastSelectorThree>()
  .with(`raycastSelectorThree`, () => {
    return {
      raycaster: new Raycaster(),
    };
  })
  .with(`view`, () => ({
    Component: (x) => <EntityRaycastSelectorDebugComponent entity={x.entity as EntityRaycastSelector} />,
  }))
  .attach({
    raycast: (entity: EntityRaycastSelectorThree) => {
      const r = entity.raycastSelector;
      const selectables = r.targets;

      if (!r.source || !selectables?.length) {
        return;
      }
      const { raycaster } = entity.raycastSelectorThree;

      const targets = [...new Set(selectables.filter((s) => s.selectable.target).map((s) => s.selectable.target!))];
      raycaster.set(r.source.position, r.source.direction);
      const intersections = raycaster.intersectObjects(targets);
      const intersection = intersections[0];

      if (intersection) {
        logger.log(`raycast - intersection`, {
          id: intersection?.instanceId,
          intersection: intersection && formatVector(intersection.point),
          position: formatVector(r.source.position),
          direction: formatVector(r.source.direction),
          targets: targets.length,
        });
      }

      const s = selectables.find(
        (s) =>
          s.selectable.target === intersection?.object && s.selectable.targetInstanceId === intersection.instanceId,
      );
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
