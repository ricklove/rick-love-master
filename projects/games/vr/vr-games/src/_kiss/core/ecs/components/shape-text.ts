import { createComponentFactory } from '../ecs-component-factory';

export type Entity_ShapeText = {
  shape: {
    kind: `text`;
    text: string;
    fontSize: number;
    alignment?: `left` | `center` | `right`;
    verticalAlignment?: `top` | `center` | `bottom`;
  };
};

export type EntityInstance_ShapeText = {
  shape: {
    text: string;
    setText: (text: string) => void;
  };
};

export const shapeTextComponentFactory = createComponentFactory<{}, Entity_ShapeText, {}, EntityInstance_ShapeText>()(
  () => {
    return {
      name: `shape_text`,
      addComponent: (entity, args: Omit<Entity_ShapeText[`shape`], `kind`>) => {
        return {
          ...entity,
          shape: {
            kind: `text`,
            ...args,
          },
        };
      },
      setup: (entity) => {
        const shape = {
          text: entity.desc.shape.text,
          setText: (text: string) => {
            // wogger.log(`setText`, text);
            shape.text = text;
          },
        };
        return {
          ...entity,
          shape,
        };
      },
    };
  },
);
