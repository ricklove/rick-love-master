import React from 'react';
import { ConsoleSimulatorPlaceholder } from '../../../../games/console-simulator/src/console-simulator-placeholder';
import { useLoadable } from '../../../../utils-react/src/loadable';

export const ConsoleSimulatorLoader = ({ initialPrompt }: { initialPrompt: string }) => {

    const { LoadedComponent: ConsoleSimulatorComp, loading, load } = useLoadable(async () => {
        const consoleCommands = (await import(`../../../../games/console-simulator/src/commands`)).createConsoleCommands(initialPrompt);
        const { ConsoleSimulator } = await import(`../../../../games/console-simulator/src/console-simulator`);
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
