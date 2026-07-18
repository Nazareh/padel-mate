import { APIGatewayProxyHandler } from 'aws-lambda';
import { markMessageRead } from './repository/message-repository.js';

const HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const playerId = event.requestContext.authorizer?.claims?.['cognito:username'];
  const messageId = event.pathParameters?.messageId;

  if (!playerId) {
    return { statusCode: 401, headers: HEADERS, body: JSON.stringify({ message: 'Unauthorized' }) };
  }
  if (!messageId) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ message: 'messageId is required' }) };
  }

  try {
    await markMessageRead(messageId, playerId);
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('mark-message-read-fn error:', err);
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
