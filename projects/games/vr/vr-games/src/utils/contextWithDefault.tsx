import React, { createContext, ReactNode, useContext } from 'react';

export const createContextWithDefault = <T extends Record<string, unknown>>(getDefaultValue: () => T) => {
  const context = createContext<T>(undefined as unknown as T);
  const useContextTyped = () => useContext(context);

  const state = {
    value: getDefaultValue(),
  };

  const Provider = ({ children }: { children: ReactNode }) => {
    return <context.Provider value={state.value}>{children}</context.Provider>;
  };

  return {
    Provider,
    Consumer: context.Consumer,
    useContext: useContextTyped,
    reset: () => {
      state.value = getDefaultValue();
    },
  };
};
