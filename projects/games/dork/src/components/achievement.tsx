import { css, Global } from '@emotion/react';
import React from 'react';

const styles = css`
  @keyframes colorChange {
    0% {
      color: #000000;
    }
    25% {
      color: #ff0000;
    }
    50% {
      color: #00ff00;
    }
    100% {
      color: #0000ff;
    }
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  div.achievement {
    opacity: 0;
    animation-name: fadeInOut;
    animation-duration: 10s;
    animation-delay: 0;
    animation-iteration-count: 1;
  }

  div.achievement-label {
    color: #000000;
    animation-name: colorChange;
    animation-duration: 4s;
    animation-delay: 2s;
    animation-iteration-count: infinite;
  }
`;

export const AchievementViewer = (props: { name: string }) => {
  return (
    <div>
      <Global styles={styles} />
      <div className='achievement' style={{ display: `flex` }}>
        <div style={{ flex: 1 }} />
        <div
          className='achievement-label'
          style={{ fontFamily: `monospace`, color: `#CCCC style={{flex:1}}CC`, fontSize: `0.8rem` }}
        >
          New Achievement!{' '}
        </div>
        <div className='achievement-name' style={{ fontFamily: `monospace` }}>
          {props.name}
        </div>
      </div>
    </div>
  );
};
