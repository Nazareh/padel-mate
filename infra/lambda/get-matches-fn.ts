import { APIGatewayProxyHandler } from "aws-lambda";
import { getMatchesForPlayer } from "./service/match-service.js";

const CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
};

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("Received event:", JSON.stringify(event));
    try {
        const playerId = event.requestContext.authorizer!.claims.sub;
        const matches = await getMatchesForPlayer(playerId);
        return {
            statusCode: 200,
            headers: CORS_HEADERS,
            body: JSON.stringify(matches),
        };
    } catch (error) {
        console.error("Error fetching matches:", error);
        return {
            statusCode: 500,
            headers: CORS_HEADERS,
            body: JSON.stringify({ message: "Error fetching matches." }),
        };
    }
};
