import { createComponentFactory } from '../ecs-component-factory';
import { GraphicsService } from '../graphics-service';
import { Entity_ShapeBox } from './shape-box';
import { Entity_ShapeSphere } from './shape-sphere';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type Entity_Graphics = {
  graphics: {
    color: number;
    visible: boolean;
  };
};

export type EntityInstance_Graphics = {
  graphics: {
    id: number;
    // visible: boolean;
    _visibleTarget: boolean;
    _visibleActual: boolean;
  };
};

export type Entity_Shape = Entity_ShapeBox | Entity_ShapeSphere;

export const graphicsComponentFactory = ({ graphicsService }: { graphicsService: GraphicsService }) =>
  createComponentFactory<
    Entity_Transform & Entity_Shape,
    Entity_Graphics,
    EntityInstance_Transform,
    EntityInstance_Graphics
  >()(() => {
    return {
      name: `graphics`,
      addComponent: (entity, args: Partial<Entity_Graphics[`graphics`]>) => {
        return {
          ...entity,
          graphics: {
            color: args.color ?? 0xffffff,
            visible: args.visible ?? true,
          },
        };
      },
      setup: (entityInstance) => {
        const shapeDesc = entityInstance.desc.shape;
        const result = graphicsService.addObject({
          shape: entityInstance.desc.shape.kind,
          visible: entityInstance.desc.graphics.visible,
          position: entityInstance.transform.position,
          quaternion: entityInstance.transform.quaternion,
          scale: shapeDesc.kind === `box` ? shapeDesc.scale : [shapeDesc.radius, shapeDesc.radius, shapeDesc.radius],
          color: entityInstance.desc.graphics.color,
        });

        return {
          ...entityInstance,
          graphics: {
            id: result.id,
            _visibleTarget: entityInstance.desc.graphics.visible,
            _visibleActual: entityInstance.desc.graphics.visible,
          },
        };
      },
      destroy: (entityInstance) => {
        graphicsService.removeObject(entityInstance.graphics.id);
      },
      activate: (entityInstance) => {
        entityInstance.graphics._visibleTarget = true;
      },
      deactivate: (entityInstance) => {
        entityInstance.graphics._visibleTarget = false;
      },
      update: (entityInstance) => {
        if (entityInstance.graphics._visibleTarget !== entityInstance.graphics._visibleActual) {
          graphicsService.setVisible(entityInstance.graphics.id, entityInstance.graphics._visibleTarget);
          entityInstance.graphics._visibleActual = entityInstance.graphics._visibleTarget;
          return;
        }
        if (!entityInstance.graphics._visibleTarget) {
          return;
        }
        graphicsService.setTransform(
          entityInstance.graphics.id,
          entityInstance.transform.position,
          entityInstance.transform.quaternion,
        );
      },
    };
  });
