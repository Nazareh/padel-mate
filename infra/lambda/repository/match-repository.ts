import { MongoClient, Collection } from 'mongodb';
import { getParameterValue } from "../service/ssm-service.js";
import { Match } from "../model.js";

let mongoClient: MongoClient;

type MatchDocument = Omit<Match, 'id'> & { _id: string };

async function getMatchCollection(): Promise<Collection<MatchDocument>> {
    if (!mongoClient) {
        mongoClient = new MongoClient(await getParameterValue(process.env.MONGO_URI_PARAM_NAME!));
        await mongoClient.connect();
    }
    let db = mongoClient.db(process.env.MONGO_DB_NAME!);
    return db.collection<MatchDocument>(process.env.MATCH_TABLE_NAME!);;
}


export async function findMatchById(id: String) {
    console.log(`Searching match by id ${id}`);
    const collection = await getMatchCollection();

    const doc = await collection.findOne({ _id: id });

    if (!doc) throw new Error(`Match not found with id: ${id}`);

    const { _id, ...rest } = doc;

    return { id: _id, ...rest } as Match;

}

export async function saveMatch(match: Match) {
    const collection = await getMatchCollection();
    const { id, ...rest } = match;
    await collection.replaceOne({ _id: id }, { ...rest }, { upsert: true });
}

export async function findAllMatchesForPlayer(playerId: string): Promise<Match[]> {
    console.log(`Searching matches for player ${playerId}...`);
    const collection = await getMatchCollection();

    const docs = await collection.find({
        "players.playerId": playerId
    }).toArray();

    console.log(`Found ${docs.length} matches for player ${playerId}`);

    return docs.map(({ _id, ...rest }) => ({ id: _id, ...rest } as Match));
}
