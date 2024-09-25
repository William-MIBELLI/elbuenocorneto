'use server';

import Stripe from "stripe";

export const capturePaymentACTION = async (paymentIntentId: string) => {
  try {
    //ON SE CONNECTE A STRIPE
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

    //ON CAPTURE LE PAYMENT
    const intent = await stripe.paymentIntents.capture(paymentIntentId);

    //SI LA CAPTURE FAILED, ON RETURN UNE ERROR
    if (intent.status !== 'succeeded') {
      throw new Error('Capture payment failed : ' + intent?.cancellation_reason)
    }

    //SINON ON RETURN L'INTENT
    return intent;
  } catch (error: any) {
    console.log('ERROR CAPTURE PAYMENT INTENT ACTION : ', error?.message);
    return null;
  }
}