import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  //req.text() is used instead of req.json() because Stripe requires the raw body to verify the signature
  const body = await req.text();

  //before we make any changes to our database i.e. update the hasPaid field, we need to make sure that the webhook request we received is really from stripe and for that stripe.webhooks.constructEvent validates that the webhook really came from Stripe using the stripe-signature header and a secret from your env (STRIPE_WEBHOOK_SECRET).

  const signature = req.headers.get("stripe-signature");

  //we have to assign undefined to below event variable otherwise typescript would think we have only defined it but not assigned anything to it hence it will give red squiggly line in the switch statement below where we use event
  let event: Stripe.Event | undefined = undefined;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    if (err instanceof Stripe.errors.StripeError) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    } else if (err instanceof Error) {
      return NextResponse.json(
        { error: `An error occurred: ${err.message}` },
        { status: 500 }
      );
    }
  }

  // Handle different event types
  switch (event?.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      // Handle successful checkout, e.g., update database

      //if there is customer email in the checkout session
      if (checkoutSession.customer_email) {
        await prisma.user.update({
          data: {
            hasPaid: true,
          },
          where: {
            email: checkoutSession.customer_email,
          },
        });
      }

      /*
      NOTE: After we have successfully paid and the checkout session is completed and we have updated the hasPaid field in the database, inside the jwt token the hasPaid property that we added manually in the jwt callback in auth.ts will still be false because the token is only created once
      */

      console.log(
        "Checkout session completed:",
        checkoutSession.id,
        checkoutSession.customer_email
      );
      break;
    // Add more cases for other event types you want to handle
    default:
      console.log(`Unhandled event type ${event?.type}`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
