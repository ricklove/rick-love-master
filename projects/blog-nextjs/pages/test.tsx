import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { exampleValue10 } from '@ricklove/example-node-lib';


type Props = {
  value: string;
}
export const getStaticProps: GetStaticProps<Props> = async (context) => {
  return {props:{
    value: `${exampleValue10.example3}: ${(await exampleValue10.run2()).c}`
  }};
}

const Page = (props: Props) => {
  return (
    <>
      <div>{props.value}</div>
    </>
  );
};

export default Page;