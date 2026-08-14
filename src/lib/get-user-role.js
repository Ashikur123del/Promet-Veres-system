import { MongoClient, ObjectId } from "mongodb";
import { resolveMongoUri } from "./resolve-mongo-uri";

export async function getUserRoleFromDb(userId) {
  if (!userId || !process.env.MONGO_DB_URI) return null;

  let client;
  try {
    client = new MongoClient(await resolveMongoUri(process.env.MONGO_DB_URI));
    await client.connect();
    const db = client.db(process.env.DB_NAME || "Prompt_Verse");
    const user = await db.collection("user").findOne(
      { _id: new ObjectId(String(userId)) },
      { projection: { role: 1 } }
    );
    return user?.role || "user";
  } catch (error) {
    console.error("getUserRoleFromDb error:", error);
    return null;
  } finally {
    if (client) await client.close();
  }
}
