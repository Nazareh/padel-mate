import { PostConfirmationTriggerEvent } from "aws-lambda";
import { savePlayer } from "./repository/player-repository.js";

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
        latestRating: 1500,
    };

    try {
        await savePlayer(item)
        console.log('Player added to DynamoDB', { id: item.id, table: tableName });
    } catch (err) {
        console.error('Failed to put item to DynamoDB', err);
        throw err; // let Cognito know the trigger failed
    }

    return event;
};