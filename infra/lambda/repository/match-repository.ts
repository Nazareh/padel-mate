import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    QueryCommandOutput,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";
import { Match } from "../model.js";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const checkMatchTableEnvVars = () => {
    const matchTableName = process.env.MATCH_TABLE_NAME;
    if (!matchTableName) {
        console.error('MATCH_TABLE_NAME env var is not set');
        throw new Error('MATCH_TABLE_NAME environment variable is required');
    }
}

export async function findMatchById(matchId: String) {
    console.log(`Searching match by id ${matchId}`);
    return (
        await dynamo.send(
            new GetCommand({
                TableName: process.env.MATCH_TABLE_NAME,
                Key: {
                    id: matchId,
                },
            })
        )
    ).Item;
}

export async function saveMatch(match: Match) {
    checkMatchTableEnvVars()
    await dynamo.send(
        new PutCommand({
            TableName: process.env.MATCH_TABLE_NAME,
            Item: match,
        })
    );
}


export async function findAllMatchesForPlayer(playerId: string): Promise<Match[]> {
    checkMatchTableEnvVars()
    let allMatches: Match[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    console.log(`Searching matches for player ${playerId}...`)

    do {
        const response: QueryCommandOutput = await dynamo.send(
            new QueryCommand({
                TableName: process.env.MATCH_TABLE_NAME,
                IndexName: "PlayerMatchesIndex", // Target the GSI
                KeyConditionExpression: "playerId = :pid",
                ExpressionAttributeValues: {
                    ":pid": playerId
                },
                ExclusiveStartKey: lastEvaluatedKey, 
            })
        );

        console.log(`Found ${response.Count} matches for player ${playerId} in this batch.`);

        if (response.Items) {
            allMatches.push(...(response.Items as Match[]));
        }

        lastEvaluatedKey = response.LastEvaluatedKey;

    } while (lastEvaluatedKey);

    return allMatches;
}
