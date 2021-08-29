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
        <div>{`How long does it take? - 6 secs! That is a bit too long! Hmm, what takes so long? heft is what takes forever!`}</div>
      </>
    );
  },
});
