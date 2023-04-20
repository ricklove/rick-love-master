import React, { createContext } from 'react';

type ProviderWithValue = { Provider: (props: { children: React.ReactNode }) => JSX.Element };
export const NestedProviders = ({
  children,
  providers,
  index = 0,
}: {
  children: React.ReactNode;
  providers: ProviderWithValue[];
  index?: number;
}) => {
  const ThisProvider = providers[index];

  if (!ThisProvider) {
    return <>{children}</>;
  }

  return (
    <ThisProvider.Provider>
      <NestedProviders providers={providers} index={++index}>
        {children}
      </NestedProviders>
    </ThisProvider.Provider>
  );
};

export const createContextWithValue = <TValue extends unknown>(getValue: () => TValue) => {
  const context = createContext<TValue | null>(null);

  return {
    context,
    Provider: ({ children }: { children: React.ReactNode }) => (
      <context.Provider value={getValue()}>{children}</context.Provider>
    ),
  };
};

// const MainContext = createContextWithValue(() => {
//   stuff: `main`;
// });
// const SubContext = createContextWithValue(() => {
//   other: `sub`;
// });
// const SubSubContext = createContextWithValue(() => {
//   more: `subsbu`;
// });

// export const AppProvider = ({ children }: { children: React.ReactNode }) => (
//   <NestedProviders providers={[MainContext, SubContext, SubSubContext]}>{children}</NestedProviders>
// );

// export const AppProviderManual = ({ children }: { children: React.ReactNode }) => (
//   <MainContext.Provider>
//     <SubContext.Provider>
//       <SubSubContext.Provider>{children}</SubSubContext.Provider>
//     </SubContext.Provider>
//   </MainContext.Provider>
// );
