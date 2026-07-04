import { APIGatewayProxyHandler } from "aws-lambda";
import { MatchAlreadySettledError, PlayerNotInMatchError, updateMatchStatus } from "./service/match-service.js";

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log("Received event:", JSON.stringify(event));
    const { pathParameters, body, requestContext } = event;

    const corsHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE,PATCH",
    };

    try {
        const requestingPlayerId = requestContext.authorizer!.claims.sub;
        const matchId = pathParameters?.matchId;

        if (!matchId) {
            return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "matchId path parameter is required" }) };
        }

        const parsedBody = JSON.parse(body!);
        const action = parsedBody?.action;

        if (action !== 'APPROVE' && action !== 'REJECT') {
            return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ message: "action must be APPROVE or REJECT" }) };
        }

        const match = await updateMatchStatus(matchId, requestingPlayerId, action);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(match),
        };
    } catch (error) {
        console.error("Error patching match:", error);

        if (error instanceof PlayerNotInMatchError) {
            return { statusCode: 403, headers: corsHeaders, body: JSON.stringify({ message: (error as Error).message }) };
        }

        if (error instanceof MatchAlreadySettledError) {
            return { statusCode: 409, headers: corsHeaders, body: JSON.stringify({ message: (error as Error).message }) };
        }

        if (error instanceof Error && error.message.includes('not found')) {
            return { statusCode: 404, headers: corsHeaders, body: JSON.stringify({ message: error.message }) };
        }

        return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ message: "Error processing the request." }) };
    }
};
