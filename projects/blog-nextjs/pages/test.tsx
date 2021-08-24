import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next'
import { exampleValue8 } from '@ricklove/example-local';


export const getStaticProps: GetStaticProps = async (context) => {
  return {props:{}};
}

const Page = () => {
  return (
    <>
      <div>{`${exampleValue8.example3}: ${exampleValue8.run2().c}`}</div>
    </>
  );
};

export default Page;