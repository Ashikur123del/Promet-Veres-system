import { headers } from "next/headers";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return Response.json({ message: "Unauthorized access" }, { status: 401 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return Response.json({ message: "Stripe is not configured" }, { status: 503 });
    }

    const db = await getDb();
    const user = await db.collection("user").findOne({
      _id: new ObjectId(String(session.user.id)),
    });

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isPremium) {
      return Response.json({ message: "You already have Premium access" }, { status: 400 });
    }

    const clientUrl =
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "PromptVerse Premium",
              description: "Unlock all private/premium prompts",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      metadata: { email: user.email },
      success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment`,
    });

    return Response.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return Response.json(
      { message: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
