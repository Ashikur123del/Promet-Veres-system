import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return Response.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return Response.json({ message: "Stripe is not configured" }, { status: 503 });
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return Response.json({ message: "session_id is required" }, { status: 400 });
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkoutSession.payment_status !== "paid") {
      return Response.json({ message: "Payment not completed yet" }, { status: 400 });
    }

    const resolvedEmail =
      checkoutSession.customer_email ||
      checkoutSession.metadata?.email ||
      session.user.email;

    if (!resolvedEmail) {
      return Response.json({ message: "Could not resolve user email" }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("user").updateOne(
      { email: resolvedEmail },
      { $set: { isPremium: true } }
    );

    const existingPayment = await db.collection("payments").findOne({
      transactionId: checkoutSession.id,
    });

    if (!existingPayment) {
      await db.collection("payments").insertOne({
        transactionId: checkoutSession.id,
        email: resolvedEmail,
        amount: (checkoutSession.amount_total || 500) / 100,
        date: new Date(),
        status: "completed",
      });
    }

    return Response.json({ isPremium: true, email: resolvedEmail });
  } catch (error) {
    console.error("Verify session error:", error);
    return Response.json(
      { message: error.message || "Failed to verify payment session" },
      { status: 500 }
    );
  }
}
