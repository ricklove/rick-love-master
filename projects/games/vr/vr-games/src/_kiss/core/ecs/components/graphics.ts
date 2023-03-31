import { createComponentFactory } from '../ecs-component-factory';
import { Entity_ShapeBox } from './shape-box';
import { Entity_ShapeSphere } from './shape-sphere';
import { Entity_Transform, EntityInstance_Transform } from './transform';

export type GraphicsService = {
  addObject: (args: {
    shape: 'box' | 'sphere';
    visible: boolean;
    position: [number, number, number];
    quaternion: [number, number, number, number];
    scale: [number, number, number];
    color: number;
  }) => { id: string };
  setVisible: (id: string, visible: boolean) => void;
  setTransform: (id: string, position: [number, number, number], quaternion: [number, number, number, number]) => void;
};

export type Entity_Graphics = {
  graphics: {
    color: number;
    visible: boolean;
  };
};

export type EntityInstance_Graphics = {
  graphics: {
    id: string;
    visible: boolean;
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
            visible: entityInstance.desc.graphics.visible,
          },
        };
      },
      activate: (entityInstance) => {
        graphicsService.setVisible(entityInstance.graphics.id, true);
      },
      deactivate: (entityInstance) => {
        graphicsService.setVisible(entityInstance.graphics.id, false);
      },
      update: (entityInstance) => {
        graphicsService.setTransform(
          entityInstance.graphics.id,
          entityInstance.transform.position,
          entityInstance.transform.quaternion,
        );
      },
    };
  });
