import { BibleToolsRoot } from '@ricklove/bible-components';

export const App = () => {
  return (
    <BibleToolsRoot
      config={{
        uploadApiUrl: `https://s7mrgkmtk5.execute-api.us-east-1.amazonaws.com/prod/upload-api`,
        esvApiKey: '8afdcf925d8895203bf43b8889ba1461223546da',
      }}
    />
  );
};