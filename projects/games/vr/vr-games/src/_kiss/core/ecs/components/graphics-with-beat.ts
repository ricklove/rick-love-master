import { BeatService } from '../beat-service';
import { createComponentFactory } from '../ecs-component-factory';
import { Entity_Graphics, EntityInstance_Graphics } from './graphics';

export type Entity_GraphicsWithBeat = {
  graphicsWithBeat: {
    colorBeat: number;
  };
};

export type EntityInstance_GraphicsWithBeat = {
  graphicsWithBeat: {
    timeBeatEndMs: number;
    colorBeat: number;
    colorNormal: number;
  };
};

export const graphicsWithBeatComponentFactory = ({ beatService }: { beatService: BeatService }) =>
  createComponentFactory<
    Entity_Graphics,
    Entity_GraphicsWithBeat,
    EntityInstance_Graphics,
    EntityInstance_GraphicsWithBeat
  >()(() => {
    return {
      name: `graphicsWithBeat`,
      addComponent: (entity, args: Entity_GraphicsWithBeat[`graphicsWithBeat`]) => {
        return {
          ...entity,
          graphicsWithBeat: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        const graphicsWithBeat = {
          colorBeat: entityInstance.desc.graphicsWithBeat.colorBeat,
          colorNormal: entityInstance.desc.graphics.color,
          timeBeatEndMs: 0,
        };

        beatService.beat.subscribe((beat) => {
          graphicsWithBeat.timeBeatEndMs = Date.now() + 100;
        });
        return {
          ...entityInstance,
          graphicsWithBeat,
        };
      },
      update: (entityInstance) => {
        const onBeat = Date.now() < entityInstance.graphicsWithBeat.timeBeatEndMs;
        const colorToUse = onBeat
          ? entityInstance.graphicsWithBeat.colorBeat
          : entityInstance.graphicsWithBeat.colorNormal;
        entityInstance.graphics.setColor(colorToUse);
      },
    };
  });
