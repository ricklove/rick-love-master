import React, { useEffect, useRef, useState } from 'react';
import { ConsoleSimulatorCss } from './console-simulator-css';
import { ConCommandResult } from './types';
import { delay } from './utils';

const consoleVersion = `v1.1.0`;

export const ConsoleSimulator = (props: {
  initialPrompt: string;
  onCommand: (command: string, onMessage: (message: ConCommandResult) => void) => Promise<ConCommandResult>;
  focusOnLoad?: boolean;
  forceExpanded?: boolean;
}) => {
  const elementInput = useRef(null as null | HTMLInputElement);
  const focusOnInput = () => {
    elementInput.current?.focus();
  };

  useEffect(() => {
    if (props.focusOnLoad) {
      focusOnInput();
    }
  }, [props.focusOnLoad]);

  const [isFocused, setIsFocused] = useState(false);
  const [command, setCommand] = useState(``);
  const [{ prompt, lines, isExpanded }, setConsoleState] = useState({
    prompt: props.initialPrompt,
    lines: [] as { prefix?: string; text?: string; Component?: () => JSX.Element }[],
    isExpanded: false,
  });

  const handleResult = (result: ConCommandResult) => {
    // console.log(`handleResult`, { result });
    const l = lines;

    if (result.addDivider) {
      l.push({ text: `---` });
    }

    result.output
      ?.split(`\n`)
      .map((x) => x.trim())
      .filter((x) => x)
      .forEach((x) => l.push({ prefix: ``, text: x }));

    if (result.Component) {
      l.push({ Component: result.Component });
    }
    if (result.quit) {
      setCommand(``);
      setConsoleState((s) => ({ prompt: props.initialPrompt, lines: [], isExpanded: false }));
      return;
    }

    setConsoleState((s) => ({ ...s, prompt: result.prompt ?? s.prompt, lines: l }));
    setTimeout(() => {
      if (elementInput.current) {
        // elementInput.current.scrollIntoView({ behavior: `smooth`, block: `center`, inline: `center` });

        const rect = elementInput.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetScroll = rect.top + scrollTop - window.innerHeight * 0.5;
        if (targetScroll > 0) {
          window.scrollTo({ left: 0, top: targetScroll, behavior: `smooth` });
        }
      }
    }, 50);
  };

  const hitEnter = async () => {
    const l = lines;
    l.push({ prefix: `${prompt} `, text: command });
    setCommand(``);
    setConsoleState((s) => ({ ...s, prompt: ``, lines: l, isExpanded: true }));

    await delay(100);
    const result = await props.onCommand(command, handleResult);
    handleResult(result);
  };

  // Force Expanded
  const isExpandedActual = props.forceExpanded ?? isExpanded;
  return (
    <>
      <ConsoleSimulatorCss />
      <div
        className='console-simulator'
        style={{ display: isExpandedActual ? `block` : `inline-block` }}
        onClick={focusOnInput}
      >
        {isExpandedActual && <span>{consoleVersion}</span>}
        {isExpandedActual &&
          lines.map((x, i) => (
            <div key={i}>
              <span>{x.prefix}</span>
              <span>{x.text}</span>
              {x.Component && (
                <span>
                  <x.Component />
                </span>
              )}
            </div>
          ))}
        <div style={{ display: isExpandedActual ? `block` : `inline-block` }}>
          <span>{prompt} </span>
          <span>{command}</span>
          <span className='console-simulator-cursor' style={isFocused ? {} : { backgroundColor: `#000000` }}>
            &nbsp;
          </span>
          <input
            type='text'
            ref={elementInput}
            style={{ opacity: 0 }}
            autoCorrect='off'
            autoCapitalize='none'
            value={command}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(x) => setCommand(x.target.value)}
            onKeyPress={(e) => e.key === `Enter` && hitEnter()}
          />
        </div>
      </div>
    </>
  );
};
