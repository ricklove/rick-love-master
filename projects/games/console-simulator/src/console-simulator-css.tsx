import { css, Global } from '@emotion/react';
import React from 'react';

const styles = css`
  div.console-simulator {
    padding-left: 8px;
    background-color: #000000;
    color: #ffffff;
    font-family: monospace;
    font-size: 14px;
    white-space: pre;
  }

  .console-simulator span {
    font-family: monospace;
    white-space: pre-wrap;
  }

  .console-simulator-cursor {
    display: inline-block;
    background-color: #777777;
    border: 1px solid #777777;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export const ConsoleSimulatorCss = () => {
  return <Global styles={styles} />;
};
