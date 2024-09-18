import { Stripe } from "stripe";
import "../../../../../envConfig";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
  const req: { amount: string } = await request.json();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: +req.amount*100,
    currency: "eur",
    use_stripe_sdk: true
  });

  // console.log("PAYMENT INTENT DANS ROUTE : ", paymentIntent);

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
    dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
  });
}
