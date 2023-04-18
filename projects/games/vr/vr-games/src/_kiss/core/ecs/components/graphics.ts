import { createComponentFactory } from '../ecs-component-factory';
import { GraphicsService } from '../graphics-service';
import { Entity_ShapeBox } from './shape-box';
import { Entity_ShapeSphere } from './shape-sphere';
import { Entity_ShapeText } from './shape-text';
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
    color: number;
    setColor: (color: number) => void;
    _visibleTarget: boolean;
    _visibleActual: boolean;
    _colors: {
      [color: number]: {
        id: number;
        color: number;
      };
    };
  };
};

export type Entity_Shape = Entity_ShapeBox | Entity_ShapeSphere | Entity_ShapeText;

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

        const createColorObject = (color: number) => {
          const result = graphicsService.addObject({
            shape: entityInstance.desc.shape.kind,
            visible: false,
            position: entityInstance.transform.position,
            quaternion: entityInstance.transform.quaternion,
            scale:
              shapeDesc.kind === `box`
                ? shapeDesc.scale
                : shapeDesc.kind === `sphere`
                ? [shapeDesc.radius, shapeDesc.radius, shapeDesc.radius]
                : [1, 1, 1],
            color,
            text:
              shapeDesc.kind === `text`
                ? {
                    text: shapeDesc.text,
                    fontSize: shapeDesc.fontSize,
                    alignment: shapeDesc.alignment ?? `center`,
                    verticalAlignment: shapeDesc.verticalAlignment ?? `center`,
                  }
                : undefined,
          });
          return {
            id: result.id,
            color,
          };
        };

        const setColor = (color: number) => {
          if (color === graphics.color) {
            return;
          }

          if (!graphics._colors[color]) {
            graphics._colors[color] = createColorObject(color);
          }

          const colorObj = graphics._colors[color];
          if (graphics.id >= 0 && graphics._visibleActual) {
            graphicsService.setVisible(graphics.id, false);
          }
          graphics.id = colorObj.id;
          graphics.color = colorObj.color;
          graphics._visibleActual = false;
        };

        const graphics: EntityInstance_Graphics[`graphics`] = {
          id: -1,
          color: -1,
          _visibleTarget: entityInstance.desc.graphics.visible,
          _visibleActual: entityInstance.desc.graphics.visible,
          _colors: {},
          setColor,
        };

        setColor(entityInstance.desc.graphics.color);

        return {
          ...entityInstance,
          graphics,
        };
      },
      destroy: (entityInstance) => {
        entityInstance.graphics._visibleTarget = false;
        graphicsService.removeObject(entityInstance.graphics.id);
        Object.values(entityInstance.graphics._colors).forEach((colorObj) => {
          graphicsService.removeObject(colorObj.id);
        });
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
