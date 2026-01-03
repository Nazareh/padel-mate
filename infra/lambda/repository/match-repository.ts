import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    ScanCommandOutput,
} from "@aws-sdk/lib-dynamodb";
import { findPlayerById } from "./player-repository.js";
import { nanoid } from "nanoid";
import { Match } from "../model.js";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

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
    await dynamo.send(
        new PutCommand({
            TableName: process.env.MATCH_TABLE_NAME,
            Item: match,
        })
    );
}


export async function findAllMatches(): Promise<Match[]> {
    let allMatches: Match[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    do {
        const response: ScanCommandOutput = await dynamo.send(
            new ScanCommand({
                TableName: process.env.MATCH_TABLE_NAME,
                ExclusiveStartKey: lastEvaluatedKey,
            })
        );

        if (response.Items) {
            allMatches.push(...(response.Items as Match[]));
        }

        lastEvaluatedKey = response.LastEvaluatedKey;

    } while (lastEvaluatedKey);

    return allMatches;
}