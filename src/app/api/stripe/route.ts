import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  //req.text() is used instead of req.json() because Stripe requires the raw body to verify the signature
  const body = await req.text();

  //before we make any changes to our database i.e. update the hasPaid field, we need to make sure that the webhook request we received is really from stripe and for that stripe.webhooks.constructEvent validates that the webhook really came from Stripe using the stripe-signature header and a secret from your env (STRIPE_WEBHOOK_SECRET).

  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      // Handle successful checkout, e.g., update database
      console.log("Checkout session completed:", checkoutSession.id);
      break;
    // Add more cases for other event types you want to handle
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
