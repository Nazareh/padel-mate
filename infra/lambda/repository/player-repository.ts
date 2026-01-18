import {
    DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    ScanCommand,
    ScanCommandOutput
} from "@aws-sdk/lib-dynamodb";
import { Player } from "../model.js";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        convertClassInstanceToMap: true,
    },
});

export async function savePlayer(player: Player) {
    await dynamo.send(
        new PutCommand({
            TableName: process.env.PLAYER_TABLE_NAME,
            Item: player,
        })
    );
}

export async function findPlayerById(id: string): Promise<Player> {
    console.log(`Finding player by id: ${id}...`)
    const player = (
        await dynamo.send(
            new GetCommand({
                TableName: process.env.PLAYER_TABLE_NAME,
                Key: {
                    id,
                },
            })
        )
    ).Item as Player;
    if (!player) {
        throw new Error("Item not found after retries");
    }

    return player

}

export async function findAllPlayers(): Promise<Player[]> {
    console.log("Finding all players...")
    let allPlayers: Player[] = [];
    let lastEvaluatedKey: Record<string, any> | undefined = undefined;

    do {
        const response: ScanCommandOutput = await dynamo.send(
            new ScanCommand({
                TableName: process.env.PLAYER_TABLE_NAME,
                ExclusiveStartKey: lastEvaluatedKey,
            })
        );

        if (response.Items) {
            allPlayers.push(...(response.Items as Player[]));
        }
        console.log(`Last evaluated key: ${response.LastEvaluatedKey}, Items found: ${response.Items?.length}`)

        lastEvaluatedKey = response.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allPlayers;
}