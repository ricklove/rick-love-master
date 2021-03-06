import React from 'react';
import { ConsoleSimulatorPlaceholder } from 'console-simulator/console-simulator-placeholder';
import { useLoadable } from 'utils-react/loadable';

export const ConsoleSimulatorLoader = ({ initialPrompt }: { initialPrompt: string }) => {

    const { LoadedComponent: ConsoleSimulatorComp, loading, load } = useLoadable(async () => {
        const consoleCommands = (await import(`console-simulator/commands`)).createConsoleCommands(initialPrompt);
        const { ConsoleSimulator } = await import(`console-simulator/console-simulator`);
        return () => (
            <ConsoleSimulator initialPrompt={`${initialPrompt}>`} onCommand={consoleCommands.onCommand} focusOnLoad forceExpanded />
        );
    });

    console.log(`ConsoleSimulatorLoader`, { loading, ConsoleSimulatorComp: !!ConsoleSimulatorComp });
    return (
        <>
            {!ConsoleSimulatorComp && <ConsoleSimulatorPlaceholder initialPrompt={`${initialPrompt}> ${loading ? `Loading...` : ``}`} onClick={() => load()} />}
            {ConsoleSimulatorComp && <ConsoleSimulatorComp />}
        </>
    );
};
