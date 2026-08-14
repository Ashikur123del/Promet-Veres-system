import { MongoClient } from "mongodb";
import { resolveMongoUri } from "./resolve-mongo-uri";

let cachedClient;
let cachedDb;

export async function getDb() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGO_DB_URI) {
    throw new Error("MONGO_DB_URI is not configured");
  }

  const uri = await resolveMongoUri(process.env.MONGO_DB_URI);
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  cachedDb = cachedClient.db(process.env.DB_NAME || "Prompt_Verse");
  return cachedDb;
}
