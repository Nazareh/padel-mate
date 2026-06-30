import { Player } from "../model.js";
import { MongoClient, Collection } from 'mongodb';
import { getParameterValue } from "../service/ssm-service.js";

let mongoClient: MongoClient;

type PlayerDocument = Omit<Player, 'id'> & { _id: string };


async function getPlayerCollection(): Promise<Collection<PlayerDocument>> {
    if (!mongoClient) {
        mongoClient = new MongoClient(await getParameterValue(process.env.MONGO_URI_PARAM_NAME!));
        await mongoClient.connect();
    }
    let db = mongoClient.db(process.env.MONGO_DB_NAME!);
    return db.collection<PlayerDocument>(process.env.PLAYER_TABLE_NAME!);;
}

export async function findPlayerById(id: string): Promise<Player> {
    const collection = await getPlayerCollection();

    const doc = await collection.findOne({ _id: id });

    if (!doc) throw new Error(`Player not found with id: ${id}`);

    const { _id, ...rest } = doc;

    return { id: _id, ...rest } as Player;
}

export async function savePlayer(player: Player) {
    const collection = await getPlayerCollection();
    const { id, ...rest } = player;
    await collection.replaceOne({ _id: id }, { ...rest }, { upsert: true });
}

export async function findAllPlayers(): Promise<Player[]> {
    console.log("Finding all players...");

    const collection = await getPlayerCollection();

    const docs = await collection.find({}).toArray();

    console.log(`Items found: ${docs.length}`);

    return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest } as Player));
}



