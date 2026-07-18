import { APIGatewayProxyHandler } from "aws-lambda";
import { findAllPlayers, findPlayerById, ensurePlayerExists } from "./repository/player-repository.js";

const HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
};

export const handler: APIGatewayProxyHandler = async (event) => {
    try {
        const claims = event.requestContext.authorizer?.claims ?? {};
        const callerId: string = claims.sub;

        if (callerId) {
            const givenName: string = claims.given_name || claims.email?.split('@')[0] || 'Player';
            const familyName: string = claims.family_name || '';
            await ensurePlayerExists({ id: callerId, givenName, familyName, latestRating: 1500 });
        }

        const data =
            event.resource === "/v1/players/{playerId}"
                ? await findPlayerById(event.path.split("/")[3])
                : await findAllPlayers();

        return {
            statusCode: data ? 200 : 404,
            headers: HEADERS,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ message: "Error reading database" }),
        };
    }
};
