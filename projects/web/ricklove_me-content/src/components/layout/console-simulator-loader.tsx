import React from 'react';
import { ConsoleSimulatorPlaceholder } from '@ricklove/console-simulator';
import { useLoadable } from '@ricklove/utils-react';

export const ConsoleSimulatorLoader = ({ initialPrompt }: { initialPrompt: string }) => {
  const {
    LoadedComponent: ConsoleSimulatorComp,
    loading,
    load,
  } = useLoadable(async () => {
    const { ConsoleSimulator, createConsoleCommands } = await import(`@ricklove/console-simulator`);
    const consoleCommands = createConsoleCommands(initialPrompt);
    return () => (
      <ConsoleSimulator
        initialPrompt={`${initialPrompt}>`}
        onCommand={consoleCommands.onCommand}
        focusOnLoad
        forceExpanded
      />
    );
  });

  console.log(`ConsoleSimulatorLoader`, { loading, ConsoleSimulatorComp: !!ConsoleSimulatorComp });
  return (
    <>
      {!ConsoleSimulatorComp && (
        <ConsoleSimulatorPlaceholder
          initialPrompt={`${initialPrompt}> ${loading ? `Loading...` : ``}`}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() => load()}
        />
      )}
      {ConsoleSimulatorComp && <ConsoleSimulatorComp />}
    </>
  );
};
