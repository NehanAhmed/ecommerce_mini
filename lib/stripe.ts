// lib/stripe.js
import Stripe from 'stripe';

// This creates a connection to Stripe using your secret key
// It's like opening a secure phone line to Stripe's computers
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Please define the STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(STRIPE_SECRET_KEY);

export default stripe;