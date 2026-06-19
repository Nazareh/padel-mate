import { HttpMethod } from "aws-cdk-lib/aws-lambda";
import { APIGatewayProxyHandler } from "aws-lambda";
import { LogMatchRequest, Match, MatchStatus } from "./model.js";
import { processMatch, findAllMatchesForPlayer } from "./repository/match-repository.js";


export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log("Received event:", JSON.stringify(event));
    console.log("Event resource:", event.resource);
    const { httpMethod, body, requestContext } = event;
    let processedMatch: Match | undefined;

    try {
        const requestingPlayerId = requestContext.authorizer!.claims.sub
        if (httpMethod == HttpMethod.POST) {
            const parsedBody = JSON.parse(body!);
            const logMatchRequest: LogMatchRequest = {
                ...parsedBody,
                startTime: new Date(parsedBody.startTime),
            };

            processedMatch = await processMatch(
                logMatchRequest,
                requestingPlayerId
            );

            const isMatchValid = processedMatch?.status != MatchStatus.INVALID
            console.log("isMatchValid", isMatchValid)
            console.log("processedMatch", processedMatch)

            return {
                statusCode: isMatchValid ? 201 : 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
                    "Access-Control-Allow-Credentials": "true", // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
                },
                body: JSON.stringify({
                    message: isMatchValid
                        ? "Match logged successfully"
                        : processedMatch?.reason
                }),
            };
        }

        else if (httpMethod == HttpMethod.GET) {
            const matches = await findAllMatchesForPlayer(requestingPlayerId)
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
                    "Access-Control-Allow-Credentials": "true", // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE",
                },
                body: JSON.stringify({
                    message: JSON.stringify(matches)
                }),
            };
        }
        
        throw new Error("invali path")

    } catch (error) {
        console.error("Error processing the request:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error processing the request." }),
        };
    }
};