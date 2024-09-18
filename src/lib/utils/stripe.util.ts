// 'use server'
// import { Stripe, loadStripe } from '@stripe/stripe-js';
// import '../../../envConfig'

// let stripePromise: Promise<Stripe | null>;

// const getStripe = async () => {
//   if (!stripePromise) {
//     stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string)
//   }
//   return stripePromise;
// }

// export default getStripe;