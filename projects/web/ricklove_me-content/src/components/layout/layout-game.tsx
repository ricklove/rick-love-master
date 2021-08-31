import React, { ReactNode } from 'react';
import { css, Global } from '@emotion/react';

const styles = css`
body {
    userSelect: none
    webkitUserSelect: none
}
`;

export const LayoutGame = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Global styles={styles} />
      <div>{children}</div>
    </>
  );
};
