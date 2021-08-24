import { GetStaticProps } from 'next';
import { exampleValue10 } from '@ricklove/example-node-lib';

type Props = { value: string };

export const getStaticProps: GetStaticProps<Props> = async (_context) => {
  return {
    props: {
      value: `${exampleValue10.example3}: ${JSON.stringify(await exampleValue10.run2(), null, 2)}!!!`,
    },
  };
};

const Page = (props: Props) => {
  return (
    <>
      <div style={{ whiteSpace: `pre` }}>{props.value}</div>
      <div>Looks like the Page changes</div>
      <div>{`But the static props doesn't get updated?`}</div>
    </>
  );
};

export default Page;
