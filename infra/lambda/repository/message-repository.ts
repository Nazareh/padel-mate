import { MongoClient, Collection, ObjectId } from 'mongodb';
import { getParameterValue } from '../service/ssm-service.js';

let mongoClient: MongoClient;

type MessageDocument = {
  _id: ObjectId;
  type: 'welcome' | 'announcement' | 'event' | 'update';
  title: string;
  body: string;
  sentAt: Date;
  audience: 'all' | 'player_ids';
  audienceValue?: string[];
};

type MessageReadDocument = {
  messageId: ObjectId;
  playerId: string;
  readAt: Date;
};

async function getDb() {
  if (!mongoClient) {
    mongoClient = new MongoClient(await getParameterValue(process.env.MONGO_URI_PARAM_NAME!));
    await mongoClient.connect();
  }
  return mongoClient.db(process.env.MONGO_DB_NAME!);
}

async function getMessagesCollection(): Promise<Collection<MessageDocument>> {
  return (await getDb()).collection<MessageDocument>('messages');
}

async function getReadsCollection(): Promise<Collection<MessageReadDocument>> {
  return (await getDb()).collection<MessageReadDocument>('message_reads');
}

export async function getMessagesForPlayer(playerId: string) {
  const messages = await getMessagesCollection();
  const reads = await getReadsCollection();

  const [docs, readDocs] = await Promise.all([
    messages
      .find({ $or: [{ audience: 'all' }, { audience: 'player_ids', audienceValue: playerId }] })
      .sort({ sentAt: -1 })
      .toArray(),
    reads.find({ playerId }).toArray(),
  ]);

  const readIds = new Set(readDocs.map(r => r.messageId.toString()));

  return docs.map(({ _id, sentAt, ...rest }) => ({
    id: _id.toString(),
    ...rest,
    sentAt: sentAt.toISOString(),
    read: readIds.has(_id.toString()),
  }));
}

export async function markMessageRead(messageId: string, playerId: string) {
  const reads = await getReadsCollection();
  await reads.updateOne(
    { messageId: new ObjectId(messageId), playerId },
    { $setOnInsert: { messageId: new ObjectId(messageId), playerId, readAt: new Date() } },
    { upsert: true }
  );
}
