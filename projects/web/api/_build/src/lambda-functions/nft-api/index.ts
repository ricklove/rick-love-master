import { APIGatewayEvent } from 'aws-lambda';
import { handleNftApiWebRequest } from '@ricklove/nft-api-server';
import { corsHeaders } from '../helpers';

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  try {
    console.log(`handler START`);
    // console.log(`event.body ${event?.body ?? `null`}`);
    // const data = JSON.parse(event?.body ?? `{}`);
    const result = await handleNftApiWebRequest({ path: event.path, params: event.queryStringParameters ?? {} });
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(`Request FAILED`, { err: error });
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: `Server Error`, error }),
    };
  }
};
