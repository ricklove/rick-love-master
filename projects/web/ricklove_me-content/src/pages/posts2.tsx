import React from 'react';
import { createPage } from '../types';

export const page = createPage({
  getStaticProps: async () => {
    return {
      props: {
        //value: `${exampleValue10.example3}: ${JSON.stringify(await exampleValue10.run2(), null, 2)}!!!`,
        value: `Static!!!`,
      },
    };
  },
  Page: (props) => {
    return (
      <>
        <div style={{ whiteSpace: `pre` }}>{props.value}</div>
        <div>Looks like the Page changes</div>
        <div>{`But the static props doesn't get updated?`}</div>
      </>
    );
  },
});
