export const createConditionSequence = (conditions: (() => boolean)[]) => {
  //   const subject = new BehaviorSubject<boolean>(false);
  const state = {
    indexNext: 0,
  };

  const update = () => {
    // subject.next(false);

    // if next condition, then progress
    const condNext = conditions[state.indexNext];
    if (!condNext || !condNext()) {
      // if not next condition, then make sure current condition is still valid
      const cond = conditions[state.indexNext - 1];
      if (cond && !cond()) {
        // reset if current condition fails
        state.indexNext = 0;
        return false;
      }

      return false;
    }

    state.indexNext++;
    if (state.indexNext >= conditions.length) {
      state.indexNext = 0;
      //   subject.next(true);
      return true;
    }

    return false;
  };

  return {
    /** Return true once each condition is true in sequence
     *
     * Each update call will progress only a single step
     *
     * If the current step enters a fail state, the step resets to zero
     */
    update,
    // value: subject.value,
    // subject: subject.pipe(distinctUntilChanged()),
  };
};
