import React from 'react';
import { Raycaster } from 'three';
import { formatVector } from '../../utils/formatters';
import { logger } from '../../utils/logger';
import { defineComponent, EntityBase } from '../core';
import { EntitySelector } from './selectable';
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
      const r = entity.selector;
      const { source } = entity.raycastSelector;
      const selectables = r.targets;

      if (!source || !selectables?.length) {
        return;
      }
      const { raycaster } = entity.raycastSelectorThree;

      const targets = [...new Set(selectables.filter((s) => s.selectable.target).map((s) => s.selectable.target!))];
      raycaster.set(source.position, source.direction);
      const intersections = raycaster.intersectObjects(targets);
      const intersection = intersections[0];

      if (intersection) {
        logger.log(`raycast - intersection`, {
          id: intersection?.instanceId,
          intersection: intersection && formatVector(intersection.point),
          position: formatVector(source.position),
          direction: formatVector(source.direction),
          targets: targets.length,
        });
      }

      const s = selectables.find(
        (s) =>
          s.selectable.target === intersection?.object && s.selectable.targetInstanceId === intersection.instanceId,
      );

      EntitySelector.changeActiveTarget(entity, s);
    },
  });
