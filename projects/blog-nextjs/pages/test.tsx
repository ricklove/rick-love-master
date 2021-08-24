import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { exampleValue10 } from '@ricklove/example';


export const getStaticProps: GetStaticProps = async (context) => {
  return {props:{}};
}

const Page = () => {
  return (
    <>
      <div>{`${exampleValue10.example3}: ${exampleValue10.run2().c}`}</div>
    </>
  );
};

export default Page;