import { APIGatewayProxyHandler } from "aws-lambda";
import { findAllPlayers, findPlayerById } from "./repository/player-repository.js";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    const tableName = process.env.PLAYER_TABLE_NAME;
    if (!tableName) {
        console.error('PLAYER_TABLE_NAME env var is not set');
        throw new Error('PLAYER_TABLE_NAME environment variable is required');
    }

    console.log("Received event:", JSON.stringify(event, null, 2));
    console.log("Event resource:", event.resource);

    try {
        const data =
            event.resource === "/v1/players/{playerId}"
                ? await findPlayerById(event.path.split("/")[3])
                : await findAllPlayers();

        return {
            statusCode: data ? 200 : 404,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
                "Access-Control-Allow-Credentials": "true", // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
            },
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error("Error reading from DynamoDB:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error reading database" }),
        };
    }
};