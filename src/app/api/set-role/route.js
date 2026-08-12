import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

export async function PATCH(request) {
  let client;
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (role !== "creator") {
      return Response.json({ message: "Invalid role" }, { status: 400 });
    }

    if (!process.env.MONGO_DB_URI || !process.env.DB_NAME) {
      return Response.json({ message: "Database not configured" }, { status: 500 });
    }

    client = new MongoClient(process.env.MONGO_DB_URI);
    await client.connect();
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { role: "creator" } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "Role updated to creator" });
  } catch (error) {
    console.error("set-role error:", error);
    return Response.json({ message: "Failed to update role" }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
