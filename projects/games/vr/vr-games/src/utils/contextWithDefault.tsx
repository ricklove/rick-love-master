import React, { createContext, ReactNode, useContext, useMemo } from 'react';

export const createContextWithDefault = <T extends Record<string, unknown>>(defaultValue: T) => {
  const context = createContext(defaultValue);
  const useContextTyped = () => useContext(context);

  const Provider = ({ children }: { children: ReactNode }) => {
    const playerContextValue = useMemo(() => {
      return defaultValue;
    }, []);

    return <context.Provider value={playerContextValue}>{children}</context.Provider>;
  };

  return {
    Provider,
    Consumer: context.Consumer,
    useContext: useContextTyped,
  };
};
