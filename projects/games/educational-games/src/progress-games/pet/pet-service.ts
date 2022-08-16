import { createSubscribable } from '@ricklove/utils-core';

export type PetEmotionKind = 'full' | 'happy' | 'hungry' | 'sick' | 'dead';
export type PetState = {
  emotion: PetEmotionKind;
  lastMealTimestamp: number;
  // If food > hunger => meal
  hunger: number;
  lastHungerIncreaseTimestamp: number;
  food: number;
};

const petStorageKey = `PetState`;
const petStorage = {
  save: (value: PetState) => {
    localStorage.setItem(petStorageKey, JSON.stringify(value));
  },
  load: () => {
    if (!localStorage.getItem(petStorageKey)) {
      return null;
    }
    try {
      return JSON.parse(localStorage.getItem(petStorageKey) ?? ``);
    } catch {
      return null;
    }
  },
};

const createPetService = () => {
  const defaultState: PetState = {
    emotion: `happy`,
    lastMealTimestamp: Date.now(),
    hunger: 0,
    lastHungerIncreaseTimestamp: Date.now(),
    food: 0,
  };
  let s: PetState = petStorage.load() ?? defaultState;
  const sub = createSubscribable<PetState>(s);

  const changePetState = (partialState: Partial<PetState>) => {
    console.log(`changePetState`, { partialState, before: { ...s } });
    s = { ...s, ...partialState };
    sub.onStateChange(s);
    petStorage.save(s);
  };

  const feed = () => {
    changePetState({
      food: s.food + 1,
    });
  };

  // Update state
  setInterval(() => {
    const maxHunger = 50;
    const min = 60 * 1000;
    const hour = 60 * min;

    // Increase hunger
    if (s.hunger < maxHunger && Date.now() > s.lastHungerIncreaseTimestamp + 1 * min) {
      const timeDelta = Date.now() - s.lastHungerIncreaseTimestamp;
      const hunderIncrease = Math.floor(timeDelta / min);
      changePetState({
        hunger: Math.min(maxHunger, s.hunger + hunderIncrease),
        lastHungerIncreaseTimestamp: Date.now(),
      });
    }

    // Consume meal
    if (s.hunger > 0 && s.food > s.hunger) {
      const extraFood = s.food - s.hunger;
      const foodEaten = s.hunger + Math.floor(0.5 * extraFood);
      changePetState({
        emotion: `full`,
        hunger: 0,
        food: s.food - foodEaten,
        lastMealTimestamp: Date.now(),
        lastHungerIncreaseTimestamp: Date.now(),
      });
    }

    // No meals
    if (Date.now() > s.lastMealTimestamp + 2 * 24 * hour) {
      if (s.emotion !== `dead`) {
        changePetState({ emotion: `dead`, hunger: maxHunger * 2 });
      }
      return;
    }
    if (Date.now() > s.lastMealTimestamp + 12 * hour) {
      if (s.emotion !== `sick`) {
        changePetState({ emotion: `sick`, hunger: maxHunger });
      }
      return;
    }
    if (Date.now() > s.lastMealTimestamp + 15 * min) {
      if (s.emotion !== `hungry`) {
        changePetState({ emotion: `hungry` });
      }
      return;
    }
    if (Date.now() > s.lastMealTimestamp + 1 * min) {
      if (s.emotion !== `happy`) {
        changePetState({ emotion: `happy` });
      }
      return;
    }

    // Fed recently
  }, 1000);

  return {
    subscribePetStateChange: sub.subscribe,
    feed,
  };
};

export type PetService = ReturnType<typeof createPetService>;

const petServiceState = {
  instance: null as null | PetService,
};
export const PetService = {
  get: () => {
    // eslint-disable-next-line no-return-assign
    return petServiceState.instance ?? (petServiceState.instance = createPetService());
  },
};
