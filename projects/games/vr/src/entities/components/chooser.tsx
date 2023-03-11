import { BehaviorSubject } from 'rxjs';
import { EntityBase } from '../core';
import { defineComponent } from '../core';

export type Choice = {
  active: boolean;
  text: string;
};
export type ChoiceEvent = `none` | `new` | `toggle` | `done` | `clear`;
export type EntityChooser = EntityBase & {
  chooser: {
    maxChoiceCount: number;
    choicesSubject: BehaviorSubject<{ choices: Choice[]; isMultiChoice: boolean; event: ChoiceEvent }>;
  };
};

export const EntityChooser = defineComponent<EntityChooser>()
  .with(`chooser`, ({ maxChoiceCount }: { maxChoiceCount: number }) => ({
    maxChoiceCount,
    choicesSubject: new BehaviorSubject({
      choices: [] as Choice[],
      isMultiChoice: false as boolean,
      event: `none` as ChoiceEvent,
    }),
  }))
  .attach({
    setChoices: (entity: EntityChooser, choices: Choice[], isMultiChoice: boolean) => {
      const { chooser } = entity;
      chooser.choicesSubject.next({ choices, isMultiChoice, event: `new` });
    },
    clearChoices: (entity: EntityChooser) => {
      const { chooser } = entity;
      chooser.choicesSubject.next({ choices: [], isMultiChoice: false, event: `clear` });
    },
    toggleChoice: (entity: EntityChooser, choice: Choice) => {
      const { choicesSubject } = entity.chooser;
      const { choices, isMultiChoice } = choicesSubject.value;
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
      choicesSubject.next({ choices, isMultiChoice, event: `toggle` });
    },
    submitChoices: (entity: EntityChooser) => {
      const { choicesSubject } = entity.chooser;
      const { choices, isMultiChoice } = choicesSubject.value;

      choicesSubject.next({ choices, isMultiChoice, event: `done` });
    },
  });
