import { wogger } from '../../worker/wogger';
import { createComponentFactory } from '../ecs-component-factory';
import { EcsSceneState, EntityDescUntyped, EntityInstanceUntyped } from '../ecs-engine';
import { EntityActionCode, parseActionCode } from './actions/parser';
import { Entity_Transform } from './transform';
import { createSmoothCurve } from './utils/smooth-curve';

export type Entity_Menu = {
  menu: {
    menuItem: {
      bounds: [number, number, number];
      prefab: EntityDescUntyped & Entity_Transform;
      setPositionAction: EntityActionCode;
      moveToTargetAction: EntityActionCode;
      setItemAction: EntityActionCode;
    };
    menuItemDetails: {
      bounds: [number, number, number];
      prefab: EntityDescUntyped & Entity_Transform;
      setPositionAction: EntityActionCode;
      setItemAction: EntityActionCode;
    };
    path: [number, number, number][];
  };
};

export type EntityInstance_Menu = {
  menu: {
    setItems: (items: { text: string }[]) => void;
    items: { text: string }[];
    _itemEntities: EntityInstanceUntyped[];
    _detailsEntity: EntityInstanceUntyped;
  };
};

export const menuComponentFactory = ({ sceneState }: { sceneState: EcsSceneState }) =>
  createComponentFactory<{}, Entity_Menu, EntityInstance_Menu, EntityInstance_Menu>()(() => {
    return {
      name: `menu`,
      addComponent: (entity, args: Entity_Menu[`menu`]) => {
        return {
          ...entity,
          menu: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const entity = entityInstance.desc;
        const bounds = entity.menu.menuItem.bounds;
        const detailsBounds = entity.menu.menuItemDetails.bounds;

        const gap = Math.max(...bounds);
        // create a smooth curve through the path at even intervals
        const path = entity.menu.path;

        const curve = createSmoothCurve({ path });
        const slotCount = Math.floor(curve.totalSegmentLength / gap);
        const slots = [...new Array(slotCount)].map((_, i) => {
          return curve.getPointOnPath(i / slotCount);
        });
        wogger.log(`slots`, { slots, curve, gap, slotCount });

        const action = parseActionCode(entity.menu.menuItem.setPositionAction);
        if (!action) {
          throw new Error(`Invalid setPositionAction: ${entity.menu.menuItem.setPositionAction}`);
        }
        const slotEntities = slots.map((slot, i) => {
          const slotEntity = sceneState.createEntityInstance(
            entity.menu.menuItem.prefab,
            entityInstance as unknown as EntityInstanceUntyped,
          );

          action.args = [slot];
          slotEntity.execute(action);

          return slotEntity;
        });

        return {
          ...entityInstance,
          menu: {
            setItems: (items) => {
              // TODO
            },
            items: [],
            _itemEntities: slotEntities,
            // TODO
            _detailsEntity: slotEntities[0],
          },
        };
      },
      update: (entityInstance) => {
        return;
      },
    };
  });
