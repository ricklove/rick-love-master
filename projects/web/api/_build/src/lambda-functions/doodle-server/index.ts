import '@babel/polyfill';
import { APIGatewayEvent } from 'aws-lambda';
import { handleDoodleTask } from '@ricklove/doodle-server';

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  try {
    console.log(`handler START`);
    await handleDoodleTask();
    return {
      statusCode: 200,
    };
  } catch (error) {
    console.error(`handler FAILED`, { err: error });
    return {
      statusCode: 500,
    };
  }
};
