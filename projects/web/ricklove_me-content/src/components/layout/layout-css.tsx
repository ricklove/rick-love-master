import React from 'react';
import { css, Global } from '@emotion/react';

const styles = css`
  /* Css Reset */

  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  body {
    line-height: 1;
  }

  ol,
  ul {
    list-style: none;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* Reset Lists */

  ul {
    list-style-type: disc;
    list-style-position: inside;
  }

  ol {
    list-style-type: decimal;
    list-style-position: inside;
  }

  ul ul,
  ol ul {
    list-style-type: circle;
    list-style-position: inside;
    margin-left: 15px;
  }

  ol ol,
  ul ol {
    list-style-type: lower-latin;
    list-style-position: inside;
    margin-left: 15px;
  }

  /* Custom */

  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter UI', 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.54;
    background-color: #292a2d;
    color: #a9a9b3;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: 'liga', 'tnum', 'case', 'calt', 'zero', 'ss01', 'locl';
    -webkit-overflow-scrolling: touch;
    -webkit-text-size-adjust: 100%;
  }

  html,
  body,
  div,
  pre,
  code,
  p,
  span {
    padding: 0;
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  ul,
  ol {
    padding-left: 8px;
    padding-right: 8px;
  }

  a {
    text-decoration: none;
  }

  a,
  a:visited,
  .link {
    color: #01ff70;
  }

  a:visited {
    color: #01bb70;
  }

  a:hover,
  a:focus,
  a:active {
    color: #2ecc40;
    cursor: pointer;
  }

  .link:hover,
  .link:focus,
  .link:active {
    color: #2ecc40;
    cursor: pointer;
  }

  .markdown-body {
    color: #a9a9b3;
  }

  pre,
  code {
    font-family: Menlo, Monaco, 'Courier New', monospace;
  }

  p {
    margin-bottom: 1.3rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #3ca4ff;
    /* color: #b27aef; */
    margin-top: 1.3rem;
    margin-bottom: 0.6rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.8rem;
  }

  h3 {
    font-size: 1.6rem;
  }

  h4 {
    font-size: 1.4rem;
  }

  h5 {
    font-size: 1.2rem;
  }

  h6 {
    font-size: 1.1rem;
  }

  small {
    font-size: 1.1em;
  }

  img,
  canvas,
  iframe,
  video,
  svg,
  select,
  textarea {
    max-width: 100%;
  }

  blockquote {
    border-left: 3px solid #01ff70;
  }

  code {
    color: #01ff70;
  }

  /* Make it movey */

  /*
main * {
    transform: translate(0px, 0);
    transition: transform 1s;
}

main :hover {
    transform: translate(2px, 0);
    transition: transform 1s;
}
*/
`;

export const LayoutCss = () => <Global styles={styles} />;
