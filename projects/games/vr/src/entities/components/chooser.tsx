import { createSubscribable, Subscribable } from '@ricklove/utils-core';
import { EntityBase } from '../core';
import { defineComponent } from '../core';

export type Choice = {
  active: boolean;
  text: string;
};
export type ChoiceEvent = `new` | `toggle` | `done`;
export type EntityChooser = EntityBase & {
  chooser: {
    maxChoiceCount: number;
    isMultiChoice: boolean;
    choices: Choice[];
    choicesObserver: Subscribable<{ choices: Choice[]; event: ChoiceEvent }>;
  };
};

export const EntityChooser = defineComponent<EntityChooser>()
  .with(`chooser`, ({ maxChoiceCount }: { maxChoiceCount: number }) => ({
    maxChoiceCount,
    isMultiChoice: false,
    choices: [],
    choicesObserver: createSubscribable(),
  }))
  .attach({
    setChoices: (entity: EntityChooser, choices: Choice[], isMultiChoice?: boolean) => {
      const { chooser } = entity;
      chooser.choices = choices;
      chooser.isMultiChoice = isMultiChoice ?? false;
      chooser.choicesObserver.onStateChange({ choices, event: `new` });
    },
    toggleChoice: (entity: EntityChooser, choice: Choice) => {
      const { isMultiChoice, choices, choicesObserver: onChange } = entity.chooser;
      const c = choices.find((x) => x.text === choice.text);
      if (!c) {
        return;
      }

      if (!isMultiChoice && choice.active) {
        choices.forEach((c) => {
          c.active = false;
        });
      }

      c.active = !c.active;
      onChange.onStateChange({ choices, event: `toggle` });
    },
    submitChoices: (entity: EntityChooser) => {
      const { choices, choicesObserver: onChange } = entity.chooser;
      onChange.onStateChange({ choices, event: `done` });
    },
  });
