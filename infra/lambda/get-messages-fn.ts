import { APIGatewayProxyHandler } from 'aws-lambda';
import { getMessagesForPlayer } from './repository/message-repository.js';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const playerId = event.requestContext.authorizer?.claims?.['cognito:username'];
  if (!playerId) {
    return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ message: 'Unauthorized' }) };
  }

  try {
    const messages = await getMessagesForPlayer(playerId);
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify(messages) };
  } catch (err) {
    console.error('get-messages-fn error:', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
