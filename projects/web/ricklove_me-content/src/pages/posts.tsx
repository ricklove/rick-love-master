import React from 'react';
import { createPage } from '../types';

// type Props = { value: string };

// export const getStaticProps: GetStaticProps<Props> = async (_context) => {
//   return {
//     props: {
//       //value: `${exampleValue10.example3}: ${JSON.stringify(await exampleValue10.run2(), null, 2)}!!!`,
//       value: `Static!!!`,
//     },
//   };
// };

// const Page = (props: Props) => {
//   return (
//     <>
//       <div style={{ whiteSpace: `pre` }}>{props.value}</div>
//       <div>Looks like the Page changes</div>
//       <div>{`But the static props doesn't get updated?`}</div>
//     </>
//   );
// };

// export default Page;

export const page_posts = createPage({
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
