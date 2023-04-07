import { createComponentFactory } from '../ecs-component-factory';
import { Entity_GameWithWaves, EntityInstance_GameWithWaves } from './game-with-waves';
import { MidiSequenceLoader } from './midi-sequence-loader';

export type Entity_GameWithMidiWaves = {
  gameWithMidiWaves: {};
};

export type EntityInstance_GameWithMidiWaves = {
  gameWithMidiWaves: {};
};

export const gameWithMidiWavesComponentFactory = ({ midiSequenceLoader }: { midiSequenceLoader: MidiSequenceLoader }) =>
  createComponentFactory<
    Entity_GameWithWaves,
    Entity_GameWithMidiWaves,
    EntityInstance_GameWithWaves,
    EntityInstance_GameWithMidiWaves
  >()(() => {
    return {
      name: `gameWithMidiWaves`,
      addComponent: (entity, args: Entity_GameWithMidiWaves[`gameWithMidiWaves`]) => {
        return {
          ...entity,
          gameWithMidiWaves: {
            ...args,
          },
        };
      },
      setup: (entityInstance) => {
        return {
          ...entityInstance,
          gameWithMidiWaves: {},
        };
      },
      update: (entityInstance) => {
        //TODO: implement
      },
    };
  });
