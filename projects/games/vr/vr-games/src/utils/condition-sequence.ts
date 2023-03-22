export const createConditionSequence = (conditions: (() => boolean)[]) => {
  //   const subject = new BehaviorSubject<boolean>(false);
  const state = {
    indexNext: 0,
  };

  const update = () => {
    // subject.next(false);
    // logger.log(`seq`, { i: state.indexNext });

    // if next condition, then progress
    const condNext = conditions[state.indexNext];
    if (condNext?.()) {
      state.indexNext++;

      // if at end, then success
      if (state.indexNext >= conditions.length) {
        state.indexNext = 0;
        // logger.log(`seq SUCCESS`, { i: state.indexNext });
        return true;
      }

      // logger.log(`seq NEXT`, { i: state.indexNext });
      return false;
    }

    // Make sure current condition is still valid
    const cond = conditions[state.indexNext - 1];
    if (cond?.()) {
      return false;
    }

    // reset if current condition fails
    // logger.log(`seq RESET`, { i: state.indexNext });
    state.indexNext = 0;
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
