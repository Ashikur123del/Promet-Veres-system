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

    const db = await getDb();
    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(String(session.user.id)) },
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
