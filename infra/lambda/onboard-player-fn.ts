import { PostConfirmationTriggerEvent } from "aws-lambda";
import { savePlayer } from "./repository/player-repository.js";

exports.handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
    const {
        request: {
            userAttributes: { sub, given_name, family_name, email },
        },
    } = event;

    const item = {
        id: sub,
        givenName: given_name,
        familyName: family_name,
        latestRating: 1500,
    };

    try {
        await savePlayer(item)
        console.log('Player saved', { id: item.id });
    } catch (err) {
        console.error(`Failed to save player ${sub}`, err);

        throw err; // let Cognito know the trigger failed
    }

    return event;
};