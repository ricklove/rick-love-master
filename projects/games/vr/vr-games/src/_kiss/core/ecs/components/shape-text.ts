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

export const shapeTextComponentFactory = createComponentFactory<{}, Entity_ShapeText>()(() => {
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
      return entity;
    },
  };
});
