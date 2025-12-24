import { PostConfirmationTriggerEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

const db = new DynamoDB.DocumentClient();

exports.handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {

    const tableName = process.env.PLAYER_TABLE_NAME;
    if (!tableName) {
        console.error('PLAYER_TABLE_NAME env var is not set');
        throw new Error('PLAYER_TABLE_NAME environment variable is required');
    }

    const {
        userName,
        request: {
            userAttributes: { given_name, family_name, email },
        },
    } = event;

    const item = {
        id: userName,
        givenName: given_name,
        familyName: family_name,
        email,
        latestRating: 1500,
    };


    try {
        await db.put({ TableName: tableName, Item: item }).promise();
        console.log('Player added to DynamoDB', { id: item.id, table: tableName });
    } catch (err) {
        console.error('Failed to put item to DynamoDB', err);
        throw err; // let Cognito know the trigger failed
    }

    return;
};