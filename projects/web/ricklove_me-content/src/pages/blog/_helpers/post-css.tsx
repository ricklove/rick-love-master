import React from 'react';
import { css, Global } from '@emotion/react';

const styles = css`
  div.post-item-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100%;
  }

  div.post-item {
    margin: 16px;
    box-shadow: 1px 2px 4px 2px #b27aef;
  }

  h2.post-item-title {
    font-size: 20px;
    color: #3ca4ff;
    font-weight: bold;
    font-style: italic;
    margin: 8px;
    margin-bottom: 0.5em;
    padding-left: 0;
    padding-bottom: 4px;
    border-bottom: #3ca4ff solid 1px;
  }

  p.post-item-meta {
    margin: 8px;
    margin-bottom: 1em;
    padding-left: 0;
    padding-bottom: 4px;
    border-bottom: #3ca4ff solid 1px;
  }

  div.post-item-related,
  div.post-item-comments {
    margin: 8px;
    padding-left: 0;
    padding-bottom: 4px;
    border-top: #3ca4ff solid 1px;
  }

  div.post-item-related h3,
  div.post-item-comments h3 {
    font-size: 20px;
    color: #3ca4ff;
    font-weight: bold;
    font-style: italic;
    margin: 8px;
    padding-left: 0;
    padding-bottom: 4px;
  }

  div.post-item {
    max-width: 800px;
    width: 100%;
  }

  div.markdown-body > p {
    max-width: 600px;
  }

  div.post-item div.code-wrapper {
    margin-left: 4px;
    margin-right: 4px;
    box-shadow: 0px 0px 2px 2px #3ca4ff;
  }

  span.markdown-image-container {
    display: block;
    margin: auto;
    max-width: 100%;
  }

  span.markdown-image-container img {
    display: block;
    margin: auto;
    border: 1px solid #3ca4ff;
  }

  @media (min-width: 800px) {
    div.post-item div.code-wrapper {
      max-width: calc(100vw - 40px);
      margin-left: calc(50% - 50vw + 20px);
      margin-right: calc(50% - 50vw + 20px);
    }

    span.markdown-image-container {
      max-width: calc(100vw - 40px);
      margin-left: calc(50% - 50vw + 20px + 100px);
      margin-right: calc(50% - 50vw + 20px - 100px);
    }
  }

  /* div.post-item p img, div.post-item div.coder-wrapper {
    margin-left: auto;
    margin-right: auto;
}  */
`;

export const PostCss = () => <Global styles={styles} />;
