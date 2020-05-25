import React, { useState } from 'react';
import { ConsoleSimulatorPlaceholder } from 'console-simulator/src/console-simulator-placeholder';
import { loadable } from 'utils-react/loadable';

export const ConsoleSimulatorLoader = ({ initialPrompt }: { initialPrompt: string }) => {

    const [visible, setVisible] = useState(false);
    const ConsoleSimulatorComp = !visible ? null : loadable(async () => {
        const consoleCommands = (await import(`console-simulator/src/commands`)).createConsoleCommands(initialPrompt);
        const { ConsoleSimulator } = await import(`console-simulator/src/console-simulator`);
        return () => (
            <ConsoleSimulator initialPrompt={`${initialPrompt}>`} onCommand={consoleCommands.onCommand} focusOnLoad forceExpanded />
        );
    });

    return (
        <>
            {!ConsoleSimulatorComp && <ConsoleSimulatorPlaceholder initialPrompt={`${initialPrompt}> ${visible ? `Loading...` : ``}`} onClick={() => setVisible(true)} />}
            {ConsoleSimulatorComp && <ConsoleSimulatorComp />}
        </>
    );
};
