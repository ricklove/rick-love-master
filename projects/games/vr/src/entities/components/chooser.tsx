import { Subject } from 'rxjs';
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
    choicesSubject: Subject<{ choices: Choice[]; event: ChoiceEvent }>;
  };
};

export const EntityChooser = defineComponent<EntityChooser>()
  .with(`chooser`, ({ maxChoiceCount }: { maxChoiceCount: number }) => ({
    maxChoiceCount,
    isMultiChoice: false,
    choices: [],
    choicesSubject: new Subject(),
  }))
  .attach({
    setChoices: (entity: EntityChooser, choices: Choice[], isMultiChoice?: boolean) => {
      const { chooser } = entity;
      chooser.choices = choices;
      chooser.isMultiChoice = isMultiChoice ?? false;
      chooser.choicesSubject.next({ choices, event: `new` });
    },
    toggleChoice: (entity: EntityChooser, choice: Choice) => {
      const { isMultiChoice, choices, choicesSubject: onChange } = entity.chooser;
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
      onChange.next({ choices, event: `toggle` });
    },
    submitChoices: (entity: EntityChooser) => {
      const { choices, choicesSubject: onChange } = entity.chooser;
      onChange.next({ choices, event: `done` });
    },
  });
