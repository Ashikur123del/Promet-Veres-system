import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { role } = await request.json();

    if (role !== "creator") {
      return Response.json({ message: "Invalid role" }, { status: 400 });
    }

    const userId = session.user?.id;
    if (!userId) {
      return Response.json({ message: "Invalid session user id" }, { status: 400 });
    }

    let objectId;
    try {
      objectId = new ObjectId(String(userId));
    } catch (err) {
      console.error("Invalid user id for ObjectId:", userId, err);
      return Response.json({ message: "Invalid user id" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("user").updateOne(
      { _id: objectId },
      { $set: { role: "creator" } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ message: "Role updated to creator" });
  } catch (error) {
    console.error("set-role error:", error);
    return Response.json({ message: "Failed to update role" }, { status: 500 });
  }
}
