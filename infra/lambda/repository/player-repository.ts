import {
    DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    ScanCommand,
    ScanCommandOutput
} from "@aws-sdk/lib-dynamodb";
import { Player } from "../model.js";
import { MongoClient, Db } from 'mongodb';
import { getParameterValue } from "../service/ssm-service.js";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        convertClassInstanceToMap: true,
    },
});

const checkPlayerTableEnvVars = () => {
    const playerTableName = process.env.PLAYER_TABLE_NAME;
    if (!playerTableName) {
        console.error('PLAYER_TABLE_NAME env var is not set');
        throw new Error('PLAYER_TABLE_NAME environment variable is required');
    }
}

type PlayerDocument = Omit<Player, 'id'> & { _id: string };

export async function savePlayer(player: Player) {
    let mongoDb: Db;
    const mongoClient = new MongoClient(await getParameterValue(process.env.MONGO_URI_PARAM_NAME!));
    await mongoClient.connect();
    mongoDb = mongoClient.db(process.env.MONGO_DB_NAME!);

    if (!mongoDb) throw new Error("MongoDB not initialized. Call initMongo() first.");

    checkPlayerTableEnvVars();

    const collection = mongoDb.collection<PlayerDocument>(process.env.PLAYER_TABLE_NAME!);

    const { id, ...rest } = player;
    await collection.replaceOne(
        { _id: id },
        { ...rest },
        { upsert: true }
    );
}


// export async function savePlayer(player: Player) {
//     checkPlayerTableEnvVars()
//     await dynamo.send(
//         new PutCommand({
//             TableName: process.env.PLAYER_TABLE_NAME,
//             Item: player,
//         })
//     );
// }

export async function findPlayerById(id: string): Promise<Player> {
    checkPlayerTableEnvVars()
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
    checkPlayerTableEnvVars()
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



