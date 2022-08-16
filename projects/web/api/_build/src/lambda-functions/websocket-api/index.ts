import { APIGatewayEvent } from 'aws-lambda';
import { handleWebsocketEvent } from '@ricklove/websockets-api-server';
import { corsHeaders } from '../helpers';

export const handler = async (event: APIGatewayEvent): Promise<unknown> => {
  try {
    console.log(`handler START`);
    const result = await handleWebsocketEvent({
      body: event.body ?? ``,
      requestContext: {
        ...event.requestContext,
        connectionId: event.requestContext.connectionId ?? ``,
        domainName: event.requestContext.domainName ?? ``,
        stage: event.requestContext.stage,
        eventType: (event.requestContext.eventType as 'CONNECT' | 'DISCONNECT' | 'MESSAGE') ?? `UNKNOWN`,
      },
    });
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
